import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Username.module.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import {
  passwordValidate,
  resetPasswordValidation,
} from "../../helper/validate";

const Reset = () => {
  const formik = useFormik({
    initialValues: {
      password: "admin123",
      confirm_pwd: "admin123",
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-gray-500 text-xl w-2/3 text-center">
              Enter new password
            </span>
          </div>

          <form onSubmit={formik.handleSubmit} className="pt-20">
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="password"
                placeholder="New password"
              />
              <input
                {...formik.getFieldProps("confirm_pwd")}
                className={styles.textbox}
                type="password"
                placeholder="Repeat password"
              />
              <button type="submit" className={styles.btn}>
                Reset password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
