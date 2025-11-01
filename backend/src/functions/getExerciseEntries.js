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
    const relevantExercises = exercises.filter(exercise => {
      const cacheKey = exercise.exerciseId || '';
      const parts = cacheKey.split('#');
      // Format: userId#nativeLanguage#targetLanguage#date#vocabularyHash
      return parts.length >= 4 && 
             parts[1] === nativeLanguage && 
             parts[2] === targetLanguage;
    });

    // Extract unique dates and create entries
    const dateMap = new Map();
    
    relevantExercises.forEach(exercise => {
      const cacheKey = exercise.exerciseId || '';
      const parts = cacheKey.split('#');
      if (parts.length >= 4) {
        const date = parts[3]; // Date is the 4th part (index 3)
        const dateStr = exercise.date || date; // Use date field if available, otherwise parse from key
        
        if (!dateMap.has(dateStr)) {
          // Count responses to see if exercise was started/completed
          const userResponses = exercise.userResponses || {};
          const hasResponses = Object.keys(userResponses).length > 0;
          
          dateMap.set(dateStr, {
            date: dateStr,
            exerciseId: exercise.exerciseId,
            createdAt: exercise.createdAt,
            hasResponses: hasResponses,
            responseCount: Object.keys(userResponses).length
          });
        }
      }
    });

    // Convert map to array and sort by date (most recent first)
    const entries = Array.from(dateMap.values()).sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    return createResponse(200, { 
      entries
    });
  } catch (error) {
    console.error('Get exercise entries error:', error);
    return createResponse(500, { 
      error: 'Failed to get exercise entries',
      message: error.message 
    });
  }
};

