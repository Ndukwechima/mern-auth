import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";

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

    // check if user already exist
    const existUsername = new Promise((resolve, reject) => {
      UserModel.fineOne({ username }, function (err, user) {
        if (err) reject(new Error(err));
        if (user) reject({ error: "Username already exist" });
        resolve();
      });
    });

    // check if email already exist

    const existEmail = new Promise((resolve, reject) => {
      UserModel.fineOne({ email }, function (err, email) {
        if (err) reject(new Error(err));
        if (email) reject({ error: "Email already exist" });
        resolve();
      });
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {})
            .catch((error) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({
          error: "Enable to hashed password",
        });
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
  res.json("login route");
}

/** GET: http://localhost:8080/api/user/admin123 */
export async function getUser(req, res) {
  res.json("getUser route");
}

/** PUT http://localhost:8080/api/updateuser 
 * @param: {
     "id": "<user-id>"
 }
 body: {
     "firstName": "", 
     "address": "",
     "profile": ""
 }
*/

export async function updateUser(req, res) {
  res.json("updateUser route");
}

/** GET: http://localhost:8080/api/generateOTP*/
export async function generateOTP(req, res) {
  res.json("generateOTP route");
}

/** GET: http://localhost:8080/api/verifyOTP*/
export async function verifyOTP(req, res) {
  res.json("verifyOTP route");
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  res.json("createResetSession route");
}

//update the password when we have a valid session
/** GET: http://localhost:8080/api/resetPassword*/
export async function resetPassword(req, res) {
  res.json("resetPassword route");
}
