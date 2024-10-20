import { Router } from "express";
import Auth, { localVariables } from "../middleware/auth.js";
import { registerMail } from "../controllers/mailer.js";

const router = Router();

/** import all controllers */
import * as controller from "../controllers/appController.js";

/** POST Method */
router.route("/register").post(controller.register);
router.route("/registerMail").post(registerMail); // send email to user
router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route("/login").post(controller.verifyUser, controller.login); // login user in the app

/** GET Method */
router.route("/user/:username").get(controller.getUser); // get user data
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariables, controller.generateOTP); // generate OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP); // verify  the generated OTP
router.route("/createResetSession").get(controller.createResetSession); // create reset password session

/** PUT Method */
router.route("/updateuser").put(Auth, controller.updateUser); // update user data or profile
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword); // reset password

export default router;
