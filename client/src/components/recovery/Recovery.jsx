import styles from "../../styles/Username.module.css";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "../../store/store";
import { useEffect, useState } from "react";
import { generateOTP, verifyOTP } from "../../helper/helper";
import { useNavigate } from "react-router-dom";

const Recovery = () => {
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      generateOTP(username).then((OTP) => {
        console.log(OTP);

        if (OTP) return toast.success("OTP has been sent to your email");
        return toast.error("Unable to generate OTP");
      });
    }
  }, [username]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      let { status } = await verifyOTP({ username, code: OTP });
      console.log("Verification response status:", status); // Debugging status

      if (status === 200) {
        // Change 201 to 200 here
        toast.success("OTP verified successfully");
        return navigate("/reset");
      }
    } catch (error) {
      return toast.error("oops, Wrong OTP! Check email again");
    }

    let { status } = await verifyOTP({ username, code: OTP });
    console.log("Verification response status:", status); // Debugging status

    if (status === 200) {
      // Change 201 to 200 here
      toast.success("OTP verified successfully");
      return navigate("/reset");
    }
    return toast.error("oops!, Something when wrong ");
  }

  // resend OTP function
  function resendOTP() {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: "Sending OTP...",
      success: <b>OTP has been send to your email!</b>,
      error: <b>Failed to send OTP!</b>,
    });

    sendPromise.then((OTP) => {
      console.log(OTP);
    });
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery!</h4>
            <span className="py-4 text-gray-500 text-xl w-2/3 text-center">
              Enter OTP to recover password.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="pt-20">
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email.
                </span>
                <input
                  onChange={(e) => setOTP(e.target.value)}
                  className={styles.textbox}
                  type="text"
                  placeholder="Enter OTP"
                />
              </div>

              <button type="submit" className={styles.btn}>
                Recover
              </button>
            </div>
          </form>

          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP?
              <button onClick={resendOTP} className="text-red-500">
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
