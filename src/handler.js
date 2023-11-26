const { nanoid } = require("nanoid");
const books = require("./books");
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

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const addedBook = books.filter((book) => book.id === id);
  const isSuccess = addedBook.length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: addedBook[0].id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(400);
  return response;
};

const getArabica = async (request, h) => {
  try {
    let arabica = [];
    const querySnapshot = await getDocs(collection(db, "arabica"));
    querySnapshot.forEach((doc) => {
      const temp = {
        id: doc.id,
        ingredients: doc.data().ingredients,
        name: doc.data().name,
        steps: doc.data().steps,
      };
      arabica.push(temp);
    });

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

const addData = (request, h) => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://credible-bay-405515.asia-southeast2.firebaseio.com/", // Replace with your database URL
  });

  // Reference to your Firestore database
  const db = admin.firestore();
  // Reference to the collection
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

module.exports = { addBook, addData, getArabica };
