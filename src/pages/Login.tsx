import React, { useState, useRef } from "react";
import { generateOTP, validateOTP } from "../services/services";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

/**
 * Login component
 * @returns JSX.Element
 */

const Login: React.FC = () => {
  const [mobile, setMobile] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const {setUserdata}=useUser()
  const sendOtp = async () => {
    try {
      await generateOTP(mobile);
      setIsOtpSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleValidateOtp = async () => {
    try {
      const otpCode = otp.join("");
      const response = await validateOTP(mobile, otpCode);
      console.log(response.data.data);
      
      localStorage.setItem("data", JSON.stringify(response.data.data));
      setUserdata(response.data.data)
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input
      if (index < 5 && value !== "") {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  return (
    <div className="w-full lg:w-96 mx-auto px-10">
      <h2 className="text-lg font-bold">Login Using Phone</h2>
      <form className="max-w-xs mx-auto mt-10">
        <div className="relative">
          <span className="absolute start-0 bottom-3 text-gray-500 dark:text-gray-400">
            <svg
              className="w-4 h-4 rtl:rotate-[270deg]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 19 18"
            >
              <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
            </svg>
          </span>
          <input
            type="number"
            id="floating-phone-number"
            className="block py-2.5 ps-6 pe-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <label
            htmlFor="floating-phone-number"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:start-6 peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6  rtl:peer-focus:right-auto"
          >
            Phone number
          </label>
        </div>
      </form>

      <button
        className="bg-teal-500 mt-4 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        onClick={sendOtp}
      >{
        isOtpSent ? "Resend OTP" : "Send OTP"
      }
      </button>
      {isOtpSent && (
        <>
          <div className="w-full  mx-auto  rounded">
            <form className="shadow-md  py-6">
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputs.current[index] = el)}
                    className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    type="text"
                    maxLength={1}
                    pattern="[0-9]"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center border w-full">
                <button
                  className="bg-teal-500 w-full hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleValidateOtp}
                >
                  Verify OTP
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
