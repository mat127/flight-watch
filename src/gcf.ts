import {EventFunction} from '@google-cloud/functions-framework';
import {RaLoader} from "./ra";
import {WaLoader} from './wa';
import {load} from "./lambda";

export const handler: EventFunction = async function (event, context) {
  await Promise.all([
    load("RA_FLIGHTS", RaLoader.loadAll),
    load("WA_FLIGHTS", WaLoader.loadAll),
  ]);
  console.log("Loaded!")
}