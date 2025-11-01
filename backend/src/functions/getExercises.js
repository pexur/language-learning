import dynamoDB, { QueryCommand, GetCommand } from '../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../utils/auth.js';

const EXERCISES_TABLE = process.env.EXERCISES_TABLE;
const USERS_TABLE = process.env.USERS_TABLE;

export const handler = async (event) => {
  try {
    const user = getUserFromEvent(event);
    if (!user) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    // Get user's language preferences
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { userId: user.userId },
      })
    );
    const userData = result.Item;

    if (!userData) {
      return createResponse(404, { error: 'User not found' });
    }

    const { nativeLanguage, targetLanguage } = userData;

    // Check if date parameter is provided in query string
    const date = event.queryStringParameters?.date;

    // Get all exercises for the user
    const exercisesResult = await dynamoDB.send(
      new QueryCommand({
        TableName: EXERCISES_TABLE,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': user.userId,
        },
        ScanIndexForward: false, // Most recent first
      })
    );
    const exercises = exercisesResult.Items || [];

    // Filter exercises that match the user's current language preferences
    let relevantExercises = exercises.filter(exercise => {
      const cacheKey = exercise.exerciseId || '';
      const parts = cacheKey.split('#');
      // Format: userId#nativeLanguage#targetLanguage#date#vocabularyHash
      return parts.length >= 4 && 
             parts[1] === nativeLanguage && 
             parts[2] === targetLanguage;
    });

    // If date is provided, filter to that specific date
    if (date) {
      relevantExercises = relevantExercises.filter(exercise => {
        const exerciseDate = exercise.date || exercise.exerciseId?.split('#')[3];
        return exerciseDate === date;
      });
    }

    // Return the exercise set (most recent if no date specified, or specific date if provided)
    const targetExercise = relevantExercises.length > 0 ? relevantExercises[0] : null;

    if (!targetExercise) {
      return createResponse(200, { 
        exercises: null,
        hasExercises: false,
        date: date || null
      });
    }

    // Get user responses if they exist
    const userResponses = targetExercise.userResponses || {};

    return createResponse(200, { 
      exercises: targetExercise.exerciseData,
      hasExercises: true,
      date: targetExercise.date || date,
      exerciseId: targetExercise.exerciseId,
      userResponses: userResponses
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    return createResponse(500, { 
      error: 'Failed to get exercises',
      message: error.message 
    });
  }
};
