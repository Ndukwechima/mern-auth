import jwt from "jsonwebtoken";
import ENV from "../config.js";

export default async function Auth(req, res, next) {
  try {
    // access authorize header to header to validate request
    const token = req.headers.Authorization.split(" ")[1];

    // retrive the user details to the logged user
    const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication, Failed!" });
  }
}

export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}

// {
//   "password": "chima=/123",
//    "username": "chima123"
// }
