import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../assets/profile.png";
import styles from "../../styles/Username.module.css";
import { Toaster, toast } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../../helper/validate";
import useFetch from "../../hooks/fetch.hook";
import { useAuthStore } from "../../store/store";
import { verifyPassword } from "../../helper/helper";

const Password = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);

  // Fetch user data based on username
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,

    onSubmit: async (values) => {
      try {
        // Verifying the password and handling the promise properly
        const loginPromise = verifyPassword({
          username,
          password: values.password,
        });

        // Using toast.promise to handle async state
        toast.promise(loginPromise, {
          loading: "Logging In...",
          success: <b>Login Successfully!</b>,
          error: <b>Password Not Match!</b>, // Ensure toast handles the error gracefully
        });

        // If login is successful, navigate to profile page
        const res = await loginPromise;
        let { token } = res.data;
        localStorage.setItem("token", token);
        navigate("/profile");
      } catch (error) {}
    },
  });

  // Handle loading and server error states
  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">
              Hello {apiData?.firstName || apiData?.username}
            </h4>
            <span className="py-4 text-gray-500 text-xl w-2/3 text-center">
              Explore More by connecting with us
            </span>
          </div>

          <form onSubmit={formik.handleSubmit} className="py-1">
            <div className="profile flex justify-center items-center py-4">
              <img
                src={apiData?.profile || avatar}
                alt="avatar"
                className={styles.profile_img}
              />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="text"
                placeholder="password"
              />
              <button type="submit" className={styles.btn}>
                Sign In
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot Password?{" "}
                <Link to="/recovery" className="text-red-500">
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Password;
