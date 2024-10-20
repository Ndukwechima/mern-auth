import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ENV from "../config.js";

// https://ethereal.email/create

let nodeCongig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: ENV.EMAIL, // generated ethereal user
    pass: ENV.PASSWORD, // generated ethereal password
  },
};

let transporter = nodemailer.createTransport(nodeCongig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

/** POST: http://localhost:8080/api/registerMail
 * @param: {
  "username": "chima123",
  "password": "chima=/123",
  "text": "",
  "subject": ""
 }
 */

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  // create body of the email
  var email = {
    body: {
      name: username,
      intro:
        text ||
        "Welcome to Dev Connector! We're very excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody,
  };

  // send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "you should receive an email frm us." });
    })
    .catch((error) => res.status(500).send({ error }));
};
