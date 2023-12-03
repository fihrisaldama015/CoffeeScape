const { db } = require("../lib/firebase");
const bcrypt = require("bcrypt");

const getAllUsers = async (request, h) => {
  try {
    let users = [];
    await db
      .collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const temp = {
            id: doc.id,
            email: doc.data().email,
            name: doc.data().name,
          };
          users.push(temp);
        });
      });
    const response = h.response({
      status: "success",
      message: "get Users successfully",
      data: users,
    });
    response.code(200);
    return response;
  } catch (error) {
    console.log(error);
    const response = h.response({
      status: "fail",
      message: "get Users failed: " + error,
    });
    response.code(400);
    return response;
  }
};

const registerUser = async (request, h) => {
  try {
    if (!request.payload) {
      const response = h.response({
        status: "fail",
        message: "Please add payload",
      });
      response.code(400);
      return response;
    }

    const { email, name, password } = request.payload;

    if (!email || !name || !password) {
      const response = h.response({
        status: "fail",
        message: "Please fill all field, email, name, and password",
      });
      response.code(400);
      return response;
    }

    const userWithSameEmail = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!userWithSameEmail.empty) {
      const response = h.response({
        status: "fail",
        message: "Email already exist",
      });
      response.code(400);
      return response;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = {
      email,
      name,
      password: hashedPassword,
    };

    const user = await db.collection("users").add(data);
    const response = h.response({
      status: "success",
      message: "User created successfully",
      data: {
        id: user.id,
        email,
        name,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.log(error);
    const response = h.response({
      status: "fail",
      message: "User created failed: " + error.message,
    });
    response.code(400);
    return response;
  }
};

const loginUser = async (request, h) => {
  try {
    if (!request.payload) {
      const response = h.response({
        status: "fail",
        message: "Please add payload",
      });
      response.code(400);
      return response;
    }

    const { email, password } = request.payload;

    if (!email || !password) {
      const response = h.response({
        status: "fail",
        message: "Please fill all field, email and password",
      });
      response.code(400);
      return response;
    }

    const user = await db.collection("users").where("email", "==", email).get();

    if (user.empty) {
      const response = h.response({
        status: "fail",
        message: "User not found",
      });
      response.code(404);
      return response;
    }

    const userData = user.docs[0].data();
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      const response = h.response({
        status: "fail",
        message: "Wrong password",
      });
      response.code(400);
      return response;
    }

    const response = h.response({
      status: "success",
      message: "Login successfully",
      data: {
        id: user.docs[0].id,
        email: userData.email,
        name: userData.name,
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.log(error);
    const response = h.response({
      status: "fail",
      message: "Login failed: " + error.message,
    });
    response.code(400);
    return response;
  }
};

module.exports = { getAllUsers, registerUser, loginUser };
