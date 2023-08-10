const jwt = require("jsonwebtoken");
const { db } = require('../db');

const userCollection = db.collection('user');
//=========================================== authentication ===========================================================================================

const authentication = async function (req, res, next) {
  try {
    let token = req.headers.authentication;

    // if no token found
    if (!token) {
      return res.status(400).send({
        status: false,
        message: "Token required! Please login to generate token",
      });
    }

    // This👇 is written here to avoid internal server error (if token is not present)
    token = token.split(" ")[1];
    jwt.verify(
      token,
      "Nervesparks",

      function (error, decodedToken) {
        // if token is invalid
        if (error) {
          return res.status(401).send({
            status: false,
            message: "Token is invalid",
          });
        }
        // if token is valid

        next();
      }
    );
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = { authentication }