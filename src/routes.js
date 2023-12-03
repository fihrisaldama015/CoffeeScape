const { addData, getArabica, getArabicaById} = require("./handler");

const routes = [
  {
    method: "GET",
    path: "/add",
    handler: addData,
  },
  {
    method: "GET",
    path: "/arabica",
    handler: getArabica,
  },
  {
    method: "GET",
    path: "/arabica/{id}",
    handler: getArabicaById,
  },
];

module.exports = routes;
