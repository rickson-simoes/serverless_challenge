import { v4 as UUID } from 'uuid';

import { APIGatewayProxyHandler } from 'aws-lambda';

import { document } from '../utils/dynamodbClient';

interface ICreate {
  title: string;
  deadline: Date;
}

export const handle: APIGatewayProxyHandler = async event => {
  const { id } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as ICreate;

  const todo_id = UUID();

  await document.put({ 
    TableName: 'users_todos', 
    Item: { 
      id: todo_id, 
      user_id: id, 
      title, done: false, 
      deadline: new Date(deadline) } 
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({ 
      message: 'ToDo, criado!',
      todo: { 
        id: todo_id, 
        user_id: id, 
        title, 
        done: false, 
        deadline 
      }
    }),
    headers: { 'Content-Type': 'application/json' }
  }
}