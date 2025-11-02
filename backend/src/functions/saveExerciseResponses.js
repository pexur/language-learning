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

    // Update correctAnswerCount for words/phrases when answers are correct
    const exerciseData = exerciseItem.exerciseData || {};
    const allExercises = [
      ...(exerciseData.words || []),
      ...(exerciseData.wordsReverse || []),
      ...(exerciseData.sentences || []),
    ];

    // Track which words/phrases need their counts incremented
    const wordsToUpdate = new Set();
    const phrasesToUpdate = new Set();

    // Check each response in the new responses
    for (const [exerciseId, responseData] of Object.entries(responses)) {
      const exercise = allExercises.find(e => e.id === exerciseId);
      if (!exercise || !exercise.sources) continue;

      const previousResponse = existingResponses[exerciseId];
      const wasAlreadyCorrect = previousResponse?.isCorrect === true;
      const isNowCorrect = responseData.isCorrect === true;

      // Only increment if this is a new correct answer (wasn't already correct)
      if (isNowCorrect && !wasAlreadyCorrect) {
        for (const source of exercise.sources) {
          if (source.type === 'word') {
            wordsToUpdate.add(source.id);
          } else if (source.type === 'phrase') {
            phrasesToUpdate.add(source.id);
          }
        }
      }
    }

    // Update words - increment correctAnswerCount by 1
    // ADD operation increments the value (or initializes to 1 if field doesn't exist)
    for (const wordId of wordsToUpdate) {
      try {
        await dynamoDB.send(
          new UpdateCommand({
            TableName: WORDS_TABLE,
            Key: { 
              userId: user.userId,
              wordId: wordId 
            },
            UpdateExpression: 'ADD correctAnswerCount :one SET updatedAt = :now',
            ExpressionAttributeValues: {
              ':one': 1,
              ':now': Date.now(),
            },
          })
        );
      } catch (error) {
        console.error(`Failed to update correctAnswerCount for word ${wordId}:`, error);
        // Continue with other updates even if one fails
      }
    }

    // Update phrases - increment correctAnswerCount by 1
    // ADD operation increments the value (or initializes to 1 if field doesn't exist)
    for (const phraseId of phrasesToUpdate) {
      try {
        await dynamoDB.send(
          new UpdateCommand({
            TableName: PHRASES_TABLE,
            Key: { 
              userId: user.userId,
              phraseId: phraseId 
            },
            UpdateExpression: 'ADD correctAnswerCount :one SET updatedAt = :now',
            ExpressionAttributeValues: {
              ':one': 1,
              ':now': Date.now(),
            },
          })
        );
      } catch (error) {
        console.error(`Failed to update correctAnswerCount for phrase ${phraseId}:`, error);
        // Continue with other updates even if one fails
      }
    }

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

