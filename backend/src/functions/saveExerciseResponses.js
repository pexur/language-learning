import dynamoDB, { GetCommand, PutCommand, UpdateCommand } from '../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../utils/auth.js';

const EXERCISES_TABLE = process.env.EXERCISES_TABLE;
const WORDS_TABLE = process.env.WORDS_TABLE;
const PHRASES_TABLE = process.env.PHRASES_TABLE;

export const handler = async (event) => {
  try {
    const user = getUserFromEvent(event);
    if (!user) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    const body = JSON.parse(event.body || '{}');
    const { exerciseId, responses } = body;

    if (!exerciseId) {
      return createResponse(400, { error: 'exerciseId is required' });
    }

    if (!responses || typeof responses !== 'object') {
      return createResponse(400, { error: 'responses object is required' });
    }

    // Verify that the exercise belongs to the user
    const userId = exerciseId.split('#')[0];
    if (userId !== user.userId) {
      return createResponse(403, { error: 'Forbidden: Exercise does not belong to user' });
    }

    // Get the existing exercise item
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: EXERCISES_TABLE,
        Key: {
          userId: user.userId,
          exerciseId: exerciseId,
        },
      })
    );
    const exerciseItem = result.Item;

    if (!exerciseItem) {
      return createResponse(404, { error: 'Exercise not found' });
    }

    // Merge new responses with existing responses
    const existingResponses = exerciseItem.userResponses || {};
    const updatedResponses = {
      ...existingResponses,
      ...responses, // New responses override existing ones
    };

    // Update the exercise item
    const updatedItem = {
      ...exerciseItem,
      userResponses: updatedResponses,
      updatedAt: Date.now(),
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: EXERCISES_TABLE,
        Item: updatedItem,
      })
    );

    // Update correctAnswerCount for source words/phrases
    // Only process new responses (not already in existingResponses)
    const newResponseIds = Object.keys(responses).filter(
      id => !existingResponses[id] || existingResponses[id].isCorrect !== responses[id].isCorrect
    );
    
    if (newResponseIds.length > 0 && exerciseItem.exerciseData) {
      await updateCorrectAnswerCounts(
        exerciseItem.exerciseData,
        responses,
        newResponseIds,
        user.userId
      );
    }

    return createResponse(200, {
      success: true,
      message: 'Responses saved successfully',
    });
  } catch (error) {
    console.error('Save exercise responses error:', error);
    return createResponse(500, {
      error: 'Failed to save responses',
      message: error.message,
    });
  }
};

/**
 * Update correctAnswerCount for words/phrases based on exercise responses
 * @param {Object} exerciseData - The exercise data containing all exercises
 * @param {Object} responses - User responses object
 * @param {Array} newResponseIds - IDs of new or changed responses
 * @param {string} userId - User ID
 */
async function updateCorrectAnswerCounts(exerciseData, responses, newResponseIds, userId) {
  try {
    // Collect all exercises from the three parts
    const allExercises = [
      ...(exerciseData.words || []),
      ...(exerciseData.wordsReverse || []),
      ...(exerciseData.sentences || [])
    ];

    // Track which sources to increment
    const sourcesToIncrement = new Map(); // key: "type:id", value: { type, id }

    for (const responseId of newResponseIds) {
      const response = responses[responseId];
      
      // Only increment for correct answers
      if (response && response.isCorrect === true) {
        // Find the corresponding exercise
        const exercise = allExercises.find(ex => ex.id === responseId);
        
        if (exercise && exercise.sources && Array.isArray(exercise.sources)) {
          // Add all sources from this exercise to our increment list
          for (const source of exercise.sources) {
            const key = `${source.type}:${source.id}`;
            sourcesToIncrement.set(key, source);
          }
        }
      }
    }

    // Increment correctAnswerCount for each source
    const updatePromises = [];
    
    for (const source of sourcesToIncrement.values()) {
      if (source.type === 'word') {
        updatePromises.push(
          dynamoDB.send(
            new UpdateCommand({
              TableName: WORDS_TABLE,
              Key: {
                userId: userId,
                wordId: source.id
              },
              UpdateExpression: 'SET correctAnswerCount = if_not_exists(correctAnswerCount, :zero) + :inc',
              ExpressionAttributeValues: {
                ':inc': 1,
                ':zero': 0
              }
            })
          )
        );
      } else if (source.type === 'phrase') {
        updatePromises.push(
          dynamoDB.send(
            new UpdateCommand({
              TableName: PHRASES_TABLE,
              Key: {
                userId: userId,
                phraseId: source.id
              },
              UpdateExpression: 'SET correctAnswerCount = if_not_exists(correctAnswerCount, :zero) + :inc',
              ExpressionAttributeValues: {
                ':inc': 1,
                ':zero': 0
              }
            })
          )
        );
      }
    }

    // Execute all updates in parallel
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(`Updated correctAnswerCount for ${updatePromises.length} sources`);
    }
  } catch (error) {
    console.error('Error updating correctAnswerCount:', error);
    // Don't throw - we still want the response save to succeed
  }
}

