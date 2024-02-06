import wa from "./wa";

wa.loadAll()
  .catch(error => console.error("Error: ", error));
