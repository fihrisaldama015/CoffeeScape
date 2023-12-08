const {
  addData,
  getArabica,
  getArabicaById,
} = require("./handler/arabicaHandler");
const {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  getUserById,
  addFavoriteCoffee,
  removeFavoriteCoffee,
} = require("./handler/userHandler");
const {
  addRating,
  addCoffeeRating,
  removeRatingCoffee,
} = require("./handler/userRatingHandler");
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
  {
    method: "GET",
    path: "/users",
    handler: getAllUsers,
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: getUserById,
  },
  {
    method: "POST",
    path: "/register",
    handler: registerUser,
  },
  {
    method: "POST",
    path: "/login",
    handler: loginUser,
  },

  {
    method: "PUT",
    path: "/users/{id}",
    handler: updateUser,
  },
  {
    method: "POST",
    path: "/users/{id}/favorite",
    handler: addFavoriteCoffee,
  },
  {
    method: "DELETE",
    path: "/users/{id}/favorite",
    handler: removeFavoriteCoffee,
  },
  {
    method: "GET",
    path: "/adddatarating",
    handler: addRating,
  },
  {
    method: "POST",
    path: "/users/{id}/rating",
    handler: addCoffeeRating,
  },
  {
    method: "DELETE",
    path: "/users/{id}/rating",
    handler: removeRatingCoffee,
  },
];

module.exports = routes;
