import { Router } from "express";

const router = Router();

/** import all controllers */
import * as controller from "../controllers/appController.js";

/** POST Method */
router.route("/register").post(controller.register);

//router.route("/registerMail").post() // send email to user

router.route("/authenticate").post((req, res) => res.end()); // authenticate user

router.route("/login").post(controller.login); // login user in the app

/** GET Method */
router.route("/user/:username").get(controller.getUser); // get user data
router.route("/generateOTP").get(controller.generateOTP); // generate OTP
router.route("/verifyOTP").get(controller.verifyOTP); // verify  the generated OTP
router.route("/createResetSession").get(controller.createResetSession); // create reset password session

/** PUT Method */
router.route("/updateuser").put(controller.updateUser); // update user data or profile
router.route("/resetPassword").put(controller.resetPassword); // reset password

export default router;
