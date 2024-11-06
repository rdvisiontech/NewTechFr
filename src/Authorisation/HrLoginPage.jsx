import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast, ToastContainer } from 'react-toastify';

const HrLoginPage = (props) => {
    const { url, token } = useAuth();
    const [logInDetails, setLoginDetails] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setLoginDetails({
            ...logInDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/user/signIn`, logInDetails);

            if (response.data.userNAme) {
                localStorage.setItem("loginDetails", JSON.stringify({
                    userName: response.data.name,
                    email: response.data.userNAme,
                    token: response.data.jwtToken
                }));
                localStorage.setItem("loginTime", new Date().getTime())
                setLoginDetails({ email: "", password: "" });
                props.closeFunction();
                navigate("/");
                toast.success("Successfully logged in!");
            } else if (!response.data) {
                toast.error("Wrong password. Please try again.");
            } else if (!response.data.userNAme) {
                toast.error("Your email is not registered. Please contact the admin.");
            }

        } catch (error) {
            console.error("Error during sign-in:", error);
            toast.error("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className=" flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white rounded-xl  p-8">
                <h2 className="text-center text-3xl font-bold text-gray-800">HR Portal Sign In</h2>
                <p className="text-center text-gray-500">Sign in with your credentials to access the HR dashboard</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="text-gray-600">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Email address"
                                value={logInDetails.email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-gray-600">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Password"
                                value={logInDetails.password}
                                onChange={handleEmailChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                    >
                        Sign In
                    </button>
                </form>

                <ToastContainer />
            </div>
        </div>
    );
};

export default HrLoginPage;
