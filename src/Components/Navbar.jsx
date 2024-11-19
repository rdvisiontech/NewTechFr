import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import HrLoginPage from '../Authorisation/HrLoginPage';
import { useAuth } from '../Authorisation/AuthContext';
import logo from '../assets/Images/RD_vision_logo.png'
import closeIcon from '../assets/Images/closeButton.jpg'

function Navbar() {
    const navigate = useNavigate();
    const { isDisabled } = useAuth();

    const openHrSignInForm = () => {
        setMenu(false);
        document.getElementById("signInFormHr").showModal();
    };

    const logOut = () => {
        toggleDropdown()
        setMenu(false);
        localStorage.clear();
        navigate("/");
    };


    useEffect(() => {
        const interval = setInterval(() => {
            const loginTime = localStorage.getItem('loginTime');
            if (loginTime) {
                const currentTime = new Date().getTime();
                const timeDiff = currentTime - loginTime;
                if (timeDiff >= 10 * 60 * 60 * 1000) { // 10000 ms = 10 seconds
                    logOut();
                    navigate("/");
                    clearInterval(interval); // Stop checking after logging out
                }
            }
        }, 1000);
    })
    const closeDialogBox = () => {
        document.getElementById("signInFormHr").close();
    };

    const [menu, setMenu] = useState(false);
    const toggleMenu = () => {
        setMenu(prevMenu => !prevMenu);
    };
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    const offDropdown = () => {
        setDropdownOpen(false)
    }
    return (
        <div>
            <header className={`${isDisabled ? "bg-blue-50" : "bg-[#1462dd]"} text-white font-semibold body-font h-[120px] flex items-center`}>
                {!isDisabled && <div className="container mx-auto flex justify-between items-center p-5">
                    {/* Left Section: Logo and Title */}
                    <div className="">
                        <div className="flex items-center">
                            <img
                                src={logo}
                                alt="RDVISION Logo"
                                className="h-12 w-auto mr-3 custom-shadow"
                            />
                            <span className="text-3xl font-bold tracking-wide">
                                rDvision
                            </span>
                        </div>
                        <span className="text-sm font-medium text-gray-300 mt-2">
                            Innovating minds to discover a better future
                        </span>
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-white focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Right Section: Navigation Links */}
                    <div className="md:flex items-center hidden space-x-8"> {/* Increased space between links */}
                        <nav className="flex space-x-6"> {/* Added space between nav items */}
                            <NavLink
                                onClick={offDropdown}
                                to="/"
                                className={({ isActive }) =>
                                    `mx-5 my-1 p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:shadow-lg hover:scale-105 ${isActive
                                        ? 'bg-[#0d4d9d] text-white'
                                        : ''
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            {localStorage.getItem("loginDetails") && (
                                <div className="relative">
                                    <button
                                        onClick={toggleDropdown}
                                        className="mx-5 my-1 w-28 p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:shadow-lg hover:scale-105 bg-[#0d4d9d] text-white"
                                    >
                                        HR utility
                                    </button>
                                    {dropdownOpen && (
                                        <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                            <NavLink
                                                onClick={offDropdown}
                                                to="/post"
                                                className={({ isActive }) =>
                                                    `text-blue-600 block px-4 py-2 rounded-t-lg transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:text-white ${isActive ? 'bg-[#0d4d9d] text-white' : ''}`
                                                }
                                            >
                                                Post New Job
                                            </NavLink>
                                            <NavLink
                                                onClick={offDropdown}
                                                to="/aplicantList"
                                                className={({ isActive }) =>
                                                    `text-blue-600 block px-4 py-2 transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:text-white ${isActive ? 'bg-[#0d4d9d] text-white' : ''}`
                                                }
                                            >
                                                Received Applications
                                            </NavLink>
                                            <NavLink
                                                onClick={offDropdown}
                                                to="/postedJobs"
                                                className={({ isActive }) =>
                                                    `text-blue-600 block px-4 py-2 transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:text-white ${isActive ? 'bg-[#0d4d9d] text-white' : ''}`
                                                }
                                            >
                                                Current Openings
                                            </NavLink>
                                            <NavLink
                                                onClick={offDropdown}
                                                to="/quiz"
                                                className={({ isActive }) =>
                                                    `text-blue-600 block px-4 py-2 transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:text-white ${isActive ? 'bg-[#0d4d9d] text-white' : ''}`
                                                }
                                            >
                                                Quiz
                                            </NavLink>
                                            <NavLink
                                                onClick={offDropdown}
                                                to="/addQuestion"
                                                className={({ isActive }) =>
                                                    `text-blue-600 block px-4 py-2 transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:text-white ${isActive ? 'bg-[#0d4d9d] text-white' : ''}`
                                                }
                                            >
                                                Add Questions
                                            </NavLink>
                                            <NavLink
                                                onClick={offDropdown}
                                                to="/score"
                                                className={({ isActive }) =>
                                                    `text-blue-600 block px-4 py-2 rounded-b-lg transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:text-white ${isActive ? 'bg-[#0d4d9d] text-white' : ''}`
                                                }
                                            >
                                                Test Score
                                            </NavLink>
                                           
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* <NavLink
                                to="/about"
                                onClick={offDropdown}
                                className={({ isActive }) =>
                                    `mx-5 my-1 p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:shadow-lg hover:scale-105 ${isActive
                                        ? 'bg-[#0d4d9d] text-white'
                                        : ''
                                    }`
                                }
                            >
                                About Us
                            </NavLink>
                            <NavLink
                                to="/ourmissions"
                                onClick={offDropdown}
                                className={({ isActive }) =>
                                    `mx-5 my-1 p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:shadow-lg hover:scale-105 ${isActive
                                        ? 'bg-[#0d4d9d] text-white'
                                        : ''
                                    }`
                                }
                            >
                                Our Missions
                            </NavLink>
                            <NavLink
                                to="/workculture"
                                onClick={offDropdown}
                                className={({ isActive }) =>
                                    `mx-5 my-1 p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:shadow-lg hover:scale-105 ${isActive
                                        ? 'bg-[#0d4d9d] text-white'
                                        : ''
                                    }`
                                }
                            >
                                Work Culture
                            </NavLink>*/}
                            <NavLink
                                to="/careers"
                                onClick={offDropdown}
                                className={({ isActive }) =>
                                    `mx-5 my-1 p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#5b91d2] hover:shadow-lg hover:scale-105 ${isActive
                                        ? 'bg-[#0d4d9d] text-white'
                                        : ''
                                    }`
                                }
                            >
                                Careers
                            </NavLink>

                        </nav>
                        {localStorage.getItem("loginDetails") ? (
                            <button
                                onClick={logOut}
                                className="bg-[#0d4d9d] w-28 font-semibold text-white hover:bg-gray-800 border-0 py-1 px-4 rounded hover:scale-105 hover:shadow-lg transition-all"
                            >
                                {JSON.parse(localStorage.getItem("loginDetails")).userName} ➦
                            </button>
                        ) : (
                            <button
                                onClick={openHrSignInForm}
                                className={`${localStorage.getItem("loginDetails") ? "bg-[#0d4d9d]" : ""} w-28 font-semibold text-white hover:bg-[#5b91d2] border-0 py-1 px-4 rounded hover:scale-105 hover:shadow-lg transition-all`}
                            >
                                Hr Login
                            </button>
                        )}
                    </div>
                </div>}
                {menu && (
                    <div className="absolute top-[120px] left-0 w-full h-96 bg-[#1462dd] z-[9999] ">
                        <ul className="flex flex-col items-center p-5">
                            <nav className="flex flex-col text-white text-base "> {/* Added space between nav items */}
                                <NavLink
                                    onClick={toggleMenu}
                                    to="/"
                                    className="mb-2 hover:bg-white hover-text-blue-500 transition-all"
                                >
                                    Home
                                </NavLink>
                                {localStorage.getItem("loginDetails") && (
                                    <>
                                        <NavLink
                                            onClick={toggleMenu}
                                            to="/post"
                                            className="mb-2 hover:bg-white hover-text-blue-500 transition-all"
                                        >
                                            Post New Job
                                        </NavLink>
                                        <NavLink
                                            onClick={toggleMenu}
                                            to="/aplicantList"
                                            className="mb-2 hover:bg-white hover-text-blue-500 transition-all"
                                        >
                                            Received Applications
                                        </NavLink>
                                        <NavLink
                                            onClick={toggleMenu}
                                            to="/postedJobs"
                                            className="mb-2 hover:bg-white hover-text-blue-500 transition-all"
                                        >
                                            Current Openings
                                        </NavLink>
                                        <NavLink
                                            onClick={toggleMenu}
                                            to="/quiz"
                                            className="mb-2 hover:bg-white hover-text-blue-500 transition-all"
                                        >
                                            Quiz
                                        </NavLink>
                                        <NavLink
                                            onClick={toggleMenu}
                                            to="/addQuestion"
                                            className="mb-2 hover:bg-white hover-text-blue-500 transition-all"
                                        >
                                            Add Questions
                                        </NavLink>
                                        <NavLink
                                            onClick={toggleMenu}
                                            to="/score"
                                            className="mb-2 hover:bg-white hover-text-blue-500 transition-all"
                                        >
                                            Test Score
                                        </NavLink>
                                    </>
                                )}
                                <NavLink
                                    onClick={toggleMenu}
                                    to="/careers"
                                    className="mb-2 hover:bg-white hover-text-blue-500 transition-all"
                                >
                                    Careers
                                </NavLink>


                            </nav>
                            {localStorage.getItem("loginDetails") ? (
                                <button
                                    onClick={logOut}
                                    className="font-semibold text-white hover:bg-gray-800 border-0 py-1 px-4 rounded hover:scale-105 hover:shadow-lg transition-all"
                                >
                                    {JSON.parse(localStorage.getItem("loginDetails")).userName} ➦
                                </button>
                            ) : (
                                <button
                                    onClick={openHrSignInForm}
                                    className="font-semibold text-white hover:bg-[#5b91d2] border-0 py-1 px-4 rounded hover:scale-105 hover:shadow-lg transition-all"
                                >
                                    Hr Login
                                </button>
                            )}
                        </ul>
                    </div>
                )}
            </header>

            <dialog id="signInFormHr" className=' rounded'>
                <div className="p-8 relative">
                    <div className="absolute top-2 right-2 cursor-pointer" onClick={closeDialogBox}>
                        <img src={closeIcon} className="h-5 w-5" alt="close icon" />
                    </div>
                    <HrLoginPage closeFunction={closeDialogBox} />
                </div>
            </dialog>
        </div>
    );
}

export default Navbar;
