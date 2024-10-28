import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Authorisation/AuthContext';


// Function to convert PDF file to Base64 string
const convertPDFToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
            const arrayBuffer = reader.result;
            const byteArray = new Uint8Array(arrayBuffer);
            const binaryString = byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '');
            const base64String = btoa(binaryString);
            resolve(base64String);
        };

        reader.onerror = (error) => {
            reject(error);
        };
    });
};

// Function to convert Video file to Base64 string
const convertVideoToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = () => {
            const arrayBuffer = reader.result;
            const byteArray = new Uint8Array(arrayBuffer);
            const binaryString = byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '');
            const base64String = btoa(binaryString);
            resolve(base64String);
        };

        reader.onerror = (error) => {
            reject(error);
        };
    });
};

function ApplyJob() {
    const { url, token } = useAuth(0);
    const navigate = useNavigate();
    const { id: jobId } = useParams();
    const [otp, setOtp] = useState(0)
    const [enteredOtp, setEnteredOtp] = useState(0)
    const [applicationDetails, setApplicationDetails] = useState({
        applicantFullName: "",
        email: "",
        highestEducation: "",
        collegeName: "",
        mobileNumber: "",
        degreeName: "",
        graduationYear: "",
        cgpaGraduation: "",
        resume: null,
        introVideo: "",
        portfolio: null,
        currentLocation: "",
        experienceType: "",
        experienceInYear: "",
        about: "",
        highSchoolPercentage: "",
        twelfthPercentage: "",
        highSchoolCertificate: null,
        intermediateCertificate: null,
        graduationCertificate: null,
        postGraduationCertificate: null,
        experienceCertificate: null,
        salarySlip: null,
        jobModel: {
            jobId: jobId
        }
    });

    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const handleOnChange = async (event) => {
        const { name, value, type, files } = event.target;
    
        if (type === "file") {
            const file = files[0];
            if (file) {
                const maxSizeInBytes = 100 * 1024 * 1024; // 100MB in bytes
    
                if (file.size > maxSizeInBytes) {
                    toast.error("File size exceeds 100MB. Please choose a smaller file.");
                    event.target.value = null; // Clear the input field
                    return;
                }
    
                try {
                    let base64String = "";
                    if (name === "introVideo") {
                        base64String = await convertVideoToBase64(file);
                    } else {
                        base64String = await convertPDFToBase64(file);
                    }
                    
                    setApplicationDetails((prevState) => ({
                        ...prevState,
                        [name]: base64String
                    }));
                } catch (error) {
                    console.error('Error converting file to Base64:', error);
                }
            }
        } else if (type === "text") {
            setApplicationDetails((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    


    const applicationInfo = () => toast("You Can Apply only One Job in 3 Months");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isEmailVerified) {
            toast.error("Please verify your email before submitting.");
            return;
        }

        const requiredDocuments = [
            applicationDetails.resume,
            applicationDetails.highSchoolCertificate,
            applicationDetails.intermediateCertificate,
            applicationDetails.graduationCertificate
        ];

        const isAnyDocumentEmpty = requiredDocuments.some(doc => !doc);

        if (isAnyDocumentEmpty) {
            toast.error("Please upload all required documents before submitting.");
            return;
        }

        try {
            const response = await axios.post(`${url}/application/addApplication`, applicationDetails, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data) {
                handleOnClick();
                setApplicationDetails({
                    applicantFullName: "",
                    email: "",
                    highestEducation: "",
                    collegeName: "",
                    mobileNumber: "",
                    degreeName: "",
                    graduationYear: "",
                    cgpaGraduation: "",
                    resume: null,
                    introVideo: "",
                    portfolio: null,
                    currentLocation: "",
                    experienceType: "",
                    experienceInYear: "",
                    about: "",
                    highSchoolPercentage: "",
                    twelfthPercentage: "",
                    highSchoolCertificate: null,
                    intermediateCertificate: null,
                    graduationCertificate: null,
                    postGraduationCertificate: null,
                    experienceCertificate: null,
                    salarySlip: null,
                    jobModel: {
                        jobId: jobId
                    }
                });
                setTimeout(() => {
                    navigate("/postedJobs");
                }, 3000);
            } else {
                applicationInfo();
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            applicationInfo();
        }
    };

    const handleOnClick = () => toast("Application Submitted");

    const handleVerifyEmail = async () => {
        verifyEmail()

    };
    const verifyEmail = async () => {
        try {
            const response = await axios.post(`${url}/application/verifyemail/${applicationDetails.email}`)
            setOtp(response.data)
            document.getElementById("otp").showModal()
        } catch (e) {
            toast.info("Please Eneter a valid Email")
        }
    }
    const verifyOtp = () => {
        if (parseInt(enteredOtp) === otp) {
            document.getElementById('otp').close()
            setIsEmailVerified(true)
            toast.success("Email Verification Succesfull")
        } else {
            toast.info("Please enter Valid Otp")
        }
    }
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <section className="text-gray-800 body-font relative bg-white shadow-lg rounded-lg p-6 sm:p-8 lg:w-2/3 w-full mx-auto mb-8">
                <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg p-4 mb-4 text-sm">
                    <span className="font-semibold">Note:</span> Fields marked with <span className="text-red-600">*</span> are mandatory.
                </div>

                <div className="flex flex-col text-center w-full mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Apply for Frontend Developer</h1>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries({
                            applicantFullName: "Full Name",
                            mobileNumber: "Mobile Number",
                            email: "Email",
                            highestEducation: "Highest Education",
                            degreeName: "Degree Name",
                            collegeName: "College Name",
                            highSchoolPercentage: "High School Percentage",
                            twelfthPercentage: "12th Percentage",
                            cgpaGraduation: "CGPA in Graduation",
                            graduationYear: "Graduation Year",
                            currentLocation: "Current Location",
                            experienceType: "Experience Type",
                            experienceInYear: "Experience (in Years)",
                            about: "About"
                        }).map(([key, label]) => (
                            <div key={key} className="relative">
                                <label htmlFor={key} className={`text-sm font-medium text-gray-600 ${key !== "experienceType" && key !== "experienceInYear" && key !== "about" ? 'after:content-["*"] after:text-red-600 after:ml-1' : ''}`}>
                                    {label}
                                </label>
                                <input
                                    onChange={handleOnChange}
                                    type= "text"
                                    id={key}
                                    name={key}
                                    value={applicationDetails[key]}
                                    step={key.includes("Percentage") ? ".1" : undefined}
                                    max={key.includes("Percentage") ? "100" : undefined}
                                    min={key.includes("Percentage") ? "0" : undefined}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 py-2 px-3"
                                    required={key !== "resume" && key !== "introVideo" && key !== "portfolio" && key !== "about"}
                                />
                                {key === "email" && !isEmailVerified && applicationDetails.email && (
                                    <div className='flex justify-end pr-4'>
                                        <button
                                            type="button"
                                            onClick={handleVerifyEmail}
                                            className="text-blue-600 underline"
                                        >
                                            Verify Email
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="relative col-span-1 sm:col-span-1">
                            <label htmlFor="portfolio" className="text-sm font-medium text-gray-600">Portfolio (optional)</label>
                            <input
                                type="text"
                                id="portfolio"
                                name="portfolio"
                                onChange={handleOnChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 py-2 px-3"
                            />
                        </div>
                        <div className="relative col-span-1 sm:col-span-1">
                            <label htmlFor="introVideo" className="text-sm font-medium text-gray-600">Intro Video <span className="text-red-600">*</span><span className='' style={{ color: "red" }}>(Only mp4 file max size:100mb)</span></label>
                            <input
                                type="file"
                                id="introVideo"
                                name="introVideo"
                                accept=".mp4"
                                onChange={handleOnChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 py-2 px-3"
                                required
                            />
                        </div>
                        <div className="relative col-span-1 sm:col-span-1">
                            <label htmlFor="resume" className="text-sm font-medium text-gray-600">Resume <span className="text-red-600">*</span></label>
                            <input
                                type="file"
                                id="resume"
                                name="resume"
                                accept=".pdf"
                                onChange={handleOnChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 py-2 px-3"
                                required
                            />
                        </div>
                        <div className="relative col-span-1 sm:col-span-1">
                            <label htmlFor="highSchoolCertificate" className="text-sm font-medium text-gray-600">High School Certificate <span className="text-red-600">*</span></label>
                            <input
                                type="file"
                                id="highSchoolCertificate"
                                name="highSchoolCertificate"
                                accept=".pdf"
                                onChange={handleOnChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 py-2 px-3"
                                required
                            />
                        </div>
                        <div className="relative col-span-1 sm:col-span-1">
                            <label htmlFor="intermediateCertificate" className="text-sm font-medium text-gray-600">Intermediate Certificate <span className="text-red-600">*</span></label>
                            <input
                                type="file"
                                id="intermediateCertificate"
                                name="intermediateCertificate"
                                accept=".pdf"
                                onChange={handleOnChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 py-2 px-3"
                                required
                            />
                        </div>
                        <div className="relative col-span-1 sm:col-span-1">
                            <label htmlFor="graduationCertificate" className="text-sm font-medium text-gray-600">Graduation Certificate <span className="text-red-600">*</span></label>
                            <input
                                type="file"
                                id="graduationCertificate"
                                name="graduationCertificate"
                                accept=".pdf"
                                onChange={handleOnChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 py-2 px-3"
                                required
                            />
                        </div>
                        <div className="relative col-span-1 sm:col-span-1">
                            <label htmlFor="postGraduationCertificate" className="text-sm font-medium text-gray-600">Post Graduation Certificate (optional)</label>
                            <input
                                type="file"
                                id="postGraduationCertificate"
                                name="postGraduationCertificate"
                                accept=".pdf"
                                onChange={handleOnChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 py-2 px-3"
                            />
                        </div>
                        <div className="relative col-span-1 sm:col-span-1">
                            <label htmlFor="experienceCertificate" className="text-sm font-medium text-gray-600">Experience Certificate (optional)</label>
                            <input
                                type="file"
                                id="experienceCertificate"
                                name="experienceCertificate"
                                accept=".pdf"
                                onChange={handleOnChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 py-2 px-3"
                            />
                        </div>
                        <div className="relative col-span-1 sm:col-span-1">
                            <label htmlFor="salarySlip" className="text-sm font-medium text-gray-600">Salary Slip (optional)</label>
                            <input
                                type="file"
                                id="salarySlip"
                                name="salarySlip"
                                accept=".pdf"
                                onChange={handleOnChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700 py-2 px-3"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Submit Application</button>
                    </div>
                </form>
                <dialog id='otp' className='p-4 rounded-lg'>
                    <h2>Enter OTP</h2>
                    <input
                        type="text"
                        value={enteredOtp}
                        onChange={(e) => { setEnteredOtp(e.target.value) }}
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        className="border rounded p-2 w-full"
                    />
                    <button onClick={verifyOtp} className="mt-4 bg-blue-500 text-white rounded p-2">
                        Verify
                    </button>

                </dialog>
                <ToastContainer />
            </section>
        </div>
    );
}

export default ApplyJob;
