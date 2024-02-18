import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {RaLoader} from "./ra";
import {WaLoader} from './wa';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    await Promise.all([
      load("RA_FLIGHTS", RaLoader.loadAll),
      load("WA_FLIGHTS", WaLoader.loadAll),
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
        message: 'An error happened.',
      }),
    };
  }
}

export async function load<ParamsType,ReturnType>(
  envVarName: string,
  loader: (params:ParamsType) => Promise<ReturnType>
): Promise<ReturnType | undefined>
{
  if (process.env[envVarName] === undefined) {
    console.log(`${envVarName} is not defined, skipping flights data loading.`);
    return undefined;
  }
  const flightParams: ParamsType = JSON.parse(process.env[envVarName]!);
  return loader(flightParams);
}