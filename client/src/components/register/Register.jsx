import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import avatar from "../../assets/profile.png";
import styles from "../../styles/Username.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "../../helper/validate";
import { convertToBase64 } from "../../helper/convert";
import { registerUser } from "../../helper/helper";

const Register = () => {
  const navigate = useNavigate();
  const [fileUpload, setFileUpload] = useState();

  const formik = useFormik({
    initialValues: {
      email: "admin@gmail.com",
      username: "example123",
      password: "admin@123%",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
      values = await Object.assign(values, { profile: fileUpload || "" });
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: "Creating Account...",
        success: <b>Registered Successfully!</b>,
        error: <b>Could not Register!</b>,
      });

      registerPromise.then(function () {
        navigate("/");
      });
    },
  });

  // Formik doesn't support file upload so I have to create a function for it

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFileUpload(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: "45%", height: "90vh" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-gray-500 text-xl w-2/3 text-center">
              Happy to join you!
            </span>
          </div>

          <form onSubmit={formik.handleSubmit} className="py-1">
            <div className="profile flex justify-center items-center py-4">
              <label htmlFor="profile">
                <img
                  src={fileUpload || avatar}
                  alt="avatar"
                  className={styles.profile_img}
                />
              </label>

              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("email")}
                className={styles.textbox}
                type="text"
                placeholder="Enter email"
              />
              <input
                {...formik.getFieldProps("username")}
                className={styles.textbox}
                type="text"
                placeholder="Enter username"
              />
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="password"
                placeholder="Enter password"
              />
              <button type="submit" className={styles.btn}>
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registerd?{" "}
                <Link to="/" className="text-red-500">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
