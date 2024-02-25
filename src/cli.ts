import {RaLoader} from "./ra";
import {WaLoader} from "./wa";

const raFlightParams = require("../ra.json");
const waFlightParams = require("../wa.json");

Promise.all([
  RaLoader.loadAll(raFlightParams),
  WaLoader.loadAll(waFlightParams)
])
  .catch(error => console.error("Error: ", error));
