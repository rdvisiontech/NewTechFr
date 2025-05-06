import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const HrLoginPage = ({ closeFunction }) => {
  const [loader, setLoader] = useState(false);
  const { url } = useAuth();
  const [logInDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginDetails({
      ...logInDetails,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const response = await axios.post(`${url}/user/signIn`, logInDetails);

      if (response.data.userNAme) {
        localStorage.setItem(
          "loginDetails",
          JSON.stringify({
            userName: response.data.name,
            email: response.data.userNAme,
            token: response.data.jwtToken,
          })
        );
        console.log(response);
        localStorage.setItem("loginTime", new Date().getTime());
        setLoginDetails({ email: "", password: "" });
        closeFunction();
        if (response.data.jwtToken) {
          toast.success("Successfully logged in!", {
            position: "top-right",
            autoClose: 3000,
          });
        }

        setTimeout(() => {
          navigate("/");
        }, 2000);
        setLoader(false);
      } else if (!response.data) {
        toast.error("Incorrect password. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        setLoader(false);
      } else if (!response.data.userNAme) {
        toast.error("Email not registered. Please contact the administrator.", {
          position: "top-right",
          autoClose: 3000,
        });
        setLoader(false);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("An error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoader(false);
    }
  };

  return (
    <div className=" flex items-center justify-center ">
      <div className="w-full  rounded-2xl  p-8 bg-white space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">HR Portal Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access the HR dashboard with your credentials
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="Enter your email"
                value={logInDetails.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  placeholder="Enter your password"
                  value={logInDetails.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
          >
            {loader ? "Please Wait.." : "Sign In"}
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default HrLoginPage;
