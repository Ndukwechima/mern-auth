import toast from "react-hot-toast";
import { authenticate } from "./helper";

// Validate Login page username
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);

  if (values.username) {
    // check user exist or not
    const { status } = await authenticate(values.username);
    if (status !== 200) {
      errors.exist = toast.error("User does not exist!");
    }
  }

  return errors;
}

// Validate password
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}

// Validate Register form
export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);
  return errors;
}

// validate profile page

export async function profileValidation(values) {
  const errors = emailVerify({}, values);
  return errors;
}

// Validate Reset password
export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password not match...!");
  }
  return errors;
}

// Validate password
function passwordVerify(error = {}, values) {
  const specialChars = /[`!@#$%&*()_+\-=\[\]{};':};':"\\|,.<>\/?~]/;

  if (!values.password) {
    error.password = toast.error("password is required!");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("password can't contain spaces");
  } else if (values.password.length < 4) {
    error.password = toast.error("password must be at least 4 characters");
  } else if (values.password.length > 10) {
    error.password = toast.error("password must be at most 10 characters");
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error("password must contain special characters");
  }
  return error;
}

// Validate username
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("username is required!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("username can't contain space!");
  }
  return error;
}

// Validate email

function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("email is required!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("email can't contain space!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address!");
  }
  return error;
}
