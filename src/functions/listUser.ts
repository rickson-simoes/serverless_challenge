import { APIGatewayProxyHandler } from 'aws-lambda';

import { document } from '../utils/dynamodbClient';

export const handle: APIGatewayProxyHandler = async event => {
  const { id } = event.pathParameters;

  const response = await document.query({ 
    TableName: 'users_todos', 
    KeyConditionExpression: "user_id = :id",
    ExpressionAttributeValues: { ':id': id }
  }).promise();

  if (!response) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        message: "Usuário não existe!!" 
      }),
      headers: { 
        "Content-type" : "application/json"
      }
    }
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items),
    headers: { 'Content-Type': 'application/json' }
  }
}