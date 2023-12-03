
const arabica = require("./arabica");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.json"); // Replace with your service account key
const { db } = require("./lib/firebase");
const {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} = require("firebase/firestore");

const getArabica = async (request, h) => {
  try {
    let arabica = [];
    await db
      .collection("arabica")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const temp = {
            id: doc.id,
            ingredients: doc.data().ingredients,
            name: doc.data().name,
            steps: doc.data().steps,
          };
          arabica.push(temp);
        });
      });

    console.log("arabica => ", arabica);
    const response = h.response({
      status: "success",
      message: "get Arabica successfully",
      data: arabica,
    });
    response.code(400);
    return response;
  } catch (error) {
    console.log(error);
    const response = h.response({
      status: "fail",
      message: "get Arabica failed: " + error,
    });
    response.code(400);
    return response;
  }
};
const getArabicaById = async (request, h) => {
  try {
    const { id } = request.params; // Extract ID from request parameters
    const docRef = doc(db, 'arabica', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const arabicaRecipe = {
        id: docSnap.id,
        ingredients: data.ingredients,
        name: data.name,
        steps: data.steps,
      };

      const response = h.response({
        status: 'success',
        message: 'Fetched Arabica recipe by ID successfully',
        data: arabicaRecipe,
      });
      response.code(200);
      return response;
    } else {
      const response = h.response({
        status: 'fail',
        message: 'Arabica recipe not found',
      });
      response.code(404);
      return response;
    }
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'fail',
      message: 'Failed to get Arabica recipe by ID: ' + error.message,
    });
    response.code(500);
    return response;
  }
};


const addData = (request, h) => {
  const recipesCollection = db.collection("arabica");
  // Add the Espresso recipe to Firebase
  try {
    arabica.map((recipe) => {
      recipesCollection
        .doc(recipe.name)
        .set(recipe)
        .then(() => {
          console.log(`${recipe.name} recipe added to Firebase!`);
        })
        .catch((error) => {
          console.error(`Error adding ${recipe.name} recipe: `, error);
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
      message: `Error adding ${recipe.name} recipe: ${error}`,
    });
    response.code(400);
    return response;
  }
};

module.exports = { addData, getArabica, getArabicaById};