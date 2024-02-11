import ra from "./ra";
import wa from "./wa";

Promise.all([
  ra.loadAll(),
  wa.loadAll()
])
  .catch(error => console.error("Error: ", error));
