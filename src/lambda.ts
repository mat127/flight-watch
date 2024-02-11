import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import ra from "./ra";
import wa from './wa';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await Promise.all([
      ra.loadAll(),
      wa.loadAll()
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Data loaded.`,
      }),
    };
  }
  catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }
}