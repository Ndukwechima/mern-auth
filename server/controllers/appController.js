import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

/** Middleware for veryify user */
export async function verifyUser(req, res, next) {
  try {
    // Get username from body or query parameters
    const username =
      req.method === "GET" ? req.query.username : req.body.username;

    // Check if username is provided
    if (!username) {
      return res.status(400).send({ error: "Username is required!" });
    }

    // Check user existence
    const exist = await UserModel.findOne({ username });
    if (!exist) return res.status(401).send({ error: "User Not Found!" });

    // Call next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication Error:", error); // Log the error for debugging
    return res.status(500).send({ error: "Authentication Error" });
  }
}

/** POST: http://localhost:8080/api/register
*
* @param: {
 "username": "admin123",
 "password": "admin123",
  "email": "admin@gmail.com",
  "firstName": "bill"
  "lastName": "william"
  "mobile": "1234567890"
  "address:" "room-no-2, ABC Apartment"
  "profile": ""
}
*/

export async function register(req, res) {
  try {
    const { username, password, email, profile } = req.body;

    // Check if username already exists
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username }, (err, user) => {
        if (err) reject(new Error(err));
        if (user) reject({ error: "Username already exists" });
        resolve();
      });
    });

    // Check if email already exists
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email }, (err, email) => {
        if (err) reject(new Error(err));
        if (email) reject({ error: "Email already exists" });
        resolve();
      });
    });

    // Check both username and email existence in parallel
    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          // Hashing the password
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              // Create a new user with hashed password
              const user = new UserModel({
                username,
                password: hashedPassword, // Correctly assigning hashed password
                email,
                profile: profile || "", // Optional profile field
              });

              // Save user to the database
              user
                .save()
                .then(async (result) => {
                  // Log all users in the database after successful registration
                  const allUsers = await UserModel.find({});
                  console.log("Current Users in Database:", allUsers);

                  res.status(201).send({ msg: "User registered successfully" });
                })
                .catch((error) => res.status(500).send({ error }));
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Unable to hash password",
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

/** POST: http://localhost:8080/api/login
 * @param: {
  "username": "admin123",
  "password": "admin123"
 }
 */

export async function login(req, res) {
  const { username, password } = req.body; // Assuming you log in with username and password
  try {
    // Find user by username
    UserModel.findOne({ username })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ error: "Username not found" });
        }

        // Compare password
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(400).send({ error: "Incorrect password" });
            }

            // Create JWT token if login is successful
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24hrs" }
            );

            // Respond with token and username
            res.status(200).send({
              msg: "Login Successful!",
              token,
              username: user.username,
            });
          })
          .catch((error) => {
            return res.status(500).send({ error: "Error comparing passwords" });
          });
      })
      .catch((error) => {
        return res.status(500).send({ error: "Error finding username" });
      });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
}

/** GET: http://localhost:8080/api/user/admin123 */
export async function getUser(req, res) {
  const { username } = req.params;
  console.log("Received username:", username); // Log the received username

  try {
    // Validate the username parameter
    if (!username) return res.status(400).send({ error: "Invalid username" });

    // Find the user by username
    UserModel.findOne({ username }, function (err, user) {
      if (err) return res.status(500).send({ error: "Internal Server Error" });
      if (!user)
        return res.status(404).send({ error: "Couldn't find the User" });

      // remove password from the user object before sending it to the client

      const { password, ...rest } = Object.assign({}, user.toJSON());

      // Return the found user
      return res.status(200).send(rest);
    });
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
}

/** PUT http://localhost:8080/api/updateuser 
 * @param: {
     "header": "<token>"
 }
 body: {
     "firstName": "", 
     "address": "",
     "profile": ""
 }
*/

export async function updateUser(req, res) {
  try {
    const { userId } = req.user; // Get userId from req.user (after token validation)

    if (!userId) {
      return res.status(400).send({ error: "User ID not found!" });
    }

    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).send({ error: "Request body is empty!" });
    }

    const result = await UserModel.updateOne({ _id: userId }, body);

    if (result.nModified === 0) {
      return res
        .status(404)
        .send({ error: "User not found or no changes detected." });
    }

    return res.status(200).send({ msg: "Record Updated!" });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "An error occurred while updating the user." });
  }
}

/** GET: http://localhost:8080/api/generateOTP*/
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8080/api/verifyOTP*/
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(200).send({ msg: "Verified Successfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
}

//update the password when we have a valid session
/** GET: http://localhost:8080/api/resetPassword*/
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });
    const { username, password } = req.body;

    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword },
                function (err, data) {
                  if (err) throw err;
                  req.app.locals.resetSession = false; //reset the session

                  return res.status(200).send({ msg: "Record Updataed!" });
                }
              );
            })
            .catch((e) => {
              return res.status(500).send({ error: "Unable to hash password" });
            });
        })
        .catch((error) => {
          return res.status(404).send({ error: "Username not found!" });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
