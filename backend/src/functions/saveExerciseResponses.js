import dynamoDB, { GetCommand, PutCommand } from '../utils/dynamodb.js';
import { getUserFromEvent, createResponse } from '../utils/auth.js';
import { localDB, isLocalMode } from '../utils/localdb.js';

const EXERCISES_TABLE = process.env.EXERCISES_TABLE;

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
    let exerciseItem;
    if (isLocalMode()) {
      exerciseItem = await localDB.getExercises(exerciseId);
    } else {
      const result = await dynamoDB.send(
        new GetCommand({
          TableName: EXERCISES_TABLE,
          Key: {
            userId: user.userId,
            exerciseId: exerciseId,
          },
        })
      );
      exerciseItem = result.Item;
    }

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

    if (isLocalMode()) {
      await localDB.saveExercises(updatedItem);
    } else {
      await dynamoDB.send(
        new PutCommand({
          TableName: EXERCISES_TABLE,
          Item: updatedItem,
        })
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

