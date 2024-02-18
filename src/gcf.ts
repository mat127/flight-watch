import { HttpFunction } from '@google-cloud/functions-framework';
import {RaLoader} from "./ra";
import {WaLoader} from './wa';
import {load} from "./lambda";

export const handler: HttpFunction = async function (req, res) {
  await Promise.all([
    //load("RA_FLIGHTS", RaLoader.loadAll),
    load("WA_FLIGHTS", WaLoader.loadAll),
  ]);
  res.send("Loaded!")
}