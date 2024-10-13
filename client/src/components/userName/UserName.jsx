import React from "react";
import { Link } from "react-router-dom";
import avatar from "../../assets/profile.png";
import styles from "../../styles/Username.module.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { usernameValidate } from "../../helper/validate";

const UserName = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validate: usernameValidate,
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
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello Again!</h4>
            <span className="py-4 text-gray-500 text-xl w-2/3 text-center">
              Explore More by connecting with us
            </span>
          </div>

          <form onSubmit={formik.handleSubmit} className="py-1">
            <div className="profile flex justify-center items-center py-4">
              <img src={avatar} alt="avatar" className={styles.profile_img} />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("username")}
                className={styles.textbox}
                type="text"
                placeholder="Username"
              />
              <button type="submit" className={styles.btn}>
                Let's Go
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a Member?{" "}
                <Link to="/register" className="text-red-500">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserName;
