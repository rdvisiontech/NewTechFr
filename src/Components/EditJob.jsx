import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authorisation/AuthContext';

function EditJob(props) {
    const { url, token } = useAuth();
    const id = props.jobId;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [jobDetails, setJobDetails] = useState({
        jobTitle: "",
        requiredDegree: "",
        experienceLevel: "",
        jobDescription: "",
        requiredSkills: "",
        hrModel: {
            id: 1
        }
    });

    useEffect(() => {
        loadJobById();
    }, [id]);

    const loadJobById = async () => {
        try {
            const response = await axios.get(`${url}/jobs/getJobById/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setJobDetails({
                jobTitle: response.data.jobTitle,
                requiredDegree: response.data.requiredDegree,
                experienceLevel: response.data.experienceLevel,
                jobDescription: response.data.jobDescription,
                requiredSkills: response.data.requiredSkills,
                jobId: response.data.jobId,
                hrModel: {
                    id: 1
                }
            });
        } catch (error) {
            setError('Failed to load job details. Please try again later.');
            toast.error(error.message || 'An error occurred while fetching job details.', { transition: Zoom });
        }
    };

    const handleOnClick = () => toast.success("Job Updated Successfully", { transition: Zoom });
    const infoForSignin = () => toast.warning("Please login first", { transition: Zoom });
    const errorInUpdate = (message) => toast.error(message || "An error occurred during update", { transition: Zoom });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setJobDetails(prevJobDetails => ({
            ...prevJobDetails,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (localStorage.getItem("loginDetails")) {
                setLoading(true);
                const response = await axios.put(`${url}/jobs/update`, jobDetails, {
                    headers: {
                        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loginDetails")).token}`
                    }
                });
                if (response.status === 200) {
                    handleOnClick();
                    props.closeFunction();
                }
                setLoading(false);
            } else {
                infoForSignin();
                setLoading(false);
            }
        } catch (error) {
            setError(error.message || 'An error occurred while updating the job.');
            errorInUpdate(error.message);
            setLoading(false);
        }
    };

    return (
        <div className='my-1'>
            <section className="text-gray-600 body-font relative max-w-3xl">
                <div className="container mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Edit this posted Job</h1>
                    </div>
                    <div className="lg:w-2/3 md:w-2/3 mx-auto">
                        <form onSubmit={handleSubmit} className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="jobTitle" className="leading-7 text-sm text-gray-600">Job Title</label>
                                    <input
                                        required
                                        type="text"
                                        id="jobTitle"
                                        name="jobTitle"
                                        value={jobDetails.jobTitle}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 transition duration-300 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8"
                                    />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="experienceLevel" className="leading-7 text-sm text-gray-600">Experience Level</label>
                                    <input
                                        required
                                        type="text"
                                        id="experienceLevel"
                                        name="experienceLevel"
                                        value={jobDetails.experienceLevel}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 transition duration-300 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8"
                                    />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="requiredSkills" className="leading-7 text-sm text-gray-600">Required Skills</label>
                                    <input
                                        required
                                        type="text"
                                        id="requiredSkills"
                                        name="requiredSkills"
                                        value={jobDetails.requiredSkills}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 transition duration-300 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8"
                                    />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label htmlFor="requiredDegree" className="leading-7 text-sm text-gray-600">Required Degree</label>
                                    <input
                                        required
                                        type="text"
                                        id="requiredDegree"
                                        name="requiredDegree"
                                        value={jobDetails.requiredDegree}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 transition duration-300 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8"
                                    />
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                <div className="relative">
                                    <label htmlFor="jobDescription" className="leading-7 text-sm text-gray-600">Job Description</label>
                                    <textarea
                                        id="jobDescription"
                                        name="jobDescription"
                                        value={jobDetails.jobDescription}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 transition duration-300 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6"
                                    />
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                {loading ? <div className='w-full flex justify-center'><div className="loader"></div></div> : 
                                <button type="submit" className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg transition duration-300 ease-in-out">
                                    Update Job
                                </button>}
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </div>
    );
}

export default EditJob;
