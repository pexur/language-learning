import dynamoDB, { QueryCommand } from '../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../utils/auth.js';
import { localDB, isLocalMode } from '../utils/localdb.js';

const EXERCISES_TABLE = process.env.EXERCISES_TABLE;

export const handler = async (event) => {
  try {
    const user = getUserFromEvent(event);
    if (!user) {
      return createResponse(401, { error: 'Unauthorized' });
    }

    // Get user's language preferences
    let userData;
    if (isLocalMode()) {
      userData = await localDB.getUser(user.userId);
    } else {
      const { GetCommand } = await import('../utils/dynamodb.js');
      const result = await dynamoDB.send(
        new GetCommand({
          TableName: process.env.USERS_TABLE,
          Key: { userId: user.userId },
        })
      );
      userData = result.Item;
    }

    if (!userData) {
      return createResponse(404, { error: 'User not found' });
    }

    const { nativeLanguage, targetLanguage } = userData;

    // Get all exercises for the user
    let exercises;
    if (isLocalMode()) {
      exercises = await localDB.getAllExercises(user.userId);
    } else {
      const result = await dynamoDB.send(
        new QueryCommand({
          TableName: EXERCISES_TABLE,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': user.userId,
          },
          ScanIndexForward: false, // Most recent first
        })
      );
      exercises = result.Items || [];
    }

    // Filter exercises that match the user's current language preferences
    const relevantExercises = exercises.filter(exercise => {
      const cacheKey = exercise.exerciseId;
      const parts = cacheKey.split('#');
      return parts.length >= 3 && 
             parts[1] === nativeLanguage && 
             parts[2] === targetLanguage;
    });

    // Return the most recent exercise set for the current language
    const latestExercise = relevantExercises.length > 0 ? relevantExercises[0] : null;

    return createResponse(200, { 
      exercises: latestExercise ? latestExercise.exerciseData : null,
      hasExercises: !!latestExercise
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    return createResponse(500, { 
      error: 'Failed to get exercises',
      message: error.message 
    });
  }
};
