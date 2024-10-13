import React, { useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../../assets/profile.png";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../../helper/validate";
import { convertToBase64 } from "../../helper/convert";
import styles from "../../styles/Username.module.css";
import extend from "../../styles/Profile.module.css";

const Profile = () => {
  const [fileUpload, setFileUpload] = useState();

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "admin@gmail.com",
      mobile: "08107506573",
      address: "No2b @admin, Lagos",
    },
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: fileUpload || "" });
      console.log(values);
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
        <div
          className={`${styles.glass} ${extend.glass}`}
          style={{ width: "45%", height: "94vh" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-gray-500 text-xl w-2/3 text-center">
              You can update your profile here
            </span>
          </div>

          <form onSubmit={formik.handleSubmit} className="py-1">
            <div className="profile flex justify-center items-center py-4">
              <label htmlFor="profile">
                <img
                  src={fileUpload || avatar}
                  alt="avatar"
                  className={`${styles.profile_img} ${extend.profile_img}`}
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
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("firstname")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="First name"
                />
                <input
                  {...formik.getFieldProps("lastname")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Last name"
                />
              </div>
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="number"
                  placeholder="Mobile No"
                />
                <input
                  {...formik.getFieldProps("email")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="email"
                  placeholder="Enter email"
                />
              </div>

              <input
                {...formik.getFieldProps("address")}
                className={styles.textbox}
                type="address"
                placeholder="Enter address"
              />
              <button type="submit" className={styles.btn}>
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Come back later?{" "}
                <Link to="/" className="text-red-500">
                  Logout
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
