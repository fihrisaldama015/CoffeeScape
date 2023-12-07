const arabica = require("../rating");
const { db, FieldValue } = require("../lib/firebase");

const addRating = (request, h) => {
  const ratingsCollection = db.collection("rating");
  try {
    arabica.map((rating) => {
      ratingsCollection
        .doc(rating.name)
        .set(rating)
        .then(() => {
          console.log(`${rating.name} rating added to Firebase!`);
        })
        .catch((error) => {
          console.error(`Error adding ${rating.name} rating: `, error);
          throw new Error(error);
        });
    });
    const response = h.response({
      status: "success",
      message: "Data berhasil ditambahkan",
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: `Error adding ${rating.name} rating: ${error}`,
    });
    response.code(400);
    return response;
  }
};
const addCoffeeRating = async (request, h) => {
  try {
    const { id } = request.params;
    const { coffeeId, rating } = request.payload;
    if (!coffeeId) {
      const response = h.response({
        status: "fail",
        message: "Please fill all field, `coffeeId`",
      });
      response.code(400);
      return response;
    }
    const user = await db.collection("users").doc(id).get();
    if (!user.exists) {
      const response = h.response({
        status: "fail",
        message: "User not found",
      });
      response.code(404);
      return response;
    }
    const recipeExist = await db.collection("recipes").doc(coffeeId).get();

    if (!recipeExist.exists) {
      const response = h.response({
        status: "fail",
        message: "Recipe with id:`" + coffeeId + "` not found",
      });
      response.code(404);
      return response;
    }
    if (rating > 10 || rating < 1) {
      const response = h.response({
        status: "fail",
        message: "Please Input Rating between 1 - 10",
      });
      response.code(404);
      return response;
    }

    const userRef = db.collection("rating").doc(coffeeId);

    const allRating = await userRef.get();

    const ratingExist = allRating
      .data()
      .rating.find((item) => item.userId === id);

    if (ratingExist) {
      const response = h.response({
        status: "fail",
        message: `User with id: ${id} already give rating to this recipe with id: ${coffeeId}`,
      });
      response.code(400);
      return response;
    }

    await userRef.set(
      {
        rating: FieldValue.arrayUnion({ userId: id, rating }),
      },
      { merge: true }
    );
    console.log("Rating added successfully");
    console.log("Updated user data:", { id: user.id, rating: rating });
    const response = h.response({
      status: "success",
      message: "add rating successfully",
      data: {
        id: user.id,
        rating: rating,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.log(error);
    const response = h.response({
      status: "fail",
      message: "add rating failed: " + error,
    });
    response.code(400);
    return response;
  }
};

module.exports = { addRating, addCoffeeRating };
