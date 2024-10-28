import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../Authorisation/AuthContext';

function ApplicantList() {
    const [applicationList, setApplicationList] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedExperience, setSelectedExperience] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");  
    const { url, token } = useAuth();

    useEffect(() => {
        loadApplications();
    }, []);

    useEffect(() => {
        setSelectedExperience("");
    }, [selectedPosition]);

    const loadApplications = async () => {
        try {
            const response = await axios.get(`${url}/application/getAllApplications`, {
                headers: {
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loginDetails")).token}`
                }
            });
            setApplicationList(response.data);
            setLoading(false);
            toast.success("Applications loaded successfully!");
        } catch (error) {
            console.error("Error loading applications:", error);
            setError("Failed to load applications. Please try again later.");
            setLoading(false);
            toast.error("Failed to load applications.");
        }
    };

    const totalPositions = [...new Set(applicationList.map(application => application.jobModel.jobTitle))];
    const totalExperienceType = [...new Set(applicationList.map(application => selectedPosition.length === 0 ? application.experienceType : selectedPosition === application.jobModel.jobTitle ? application.experienceType : null))];

    const selectPosition = (event) => {
        setSelectedPosition(event.target.value);
    };

    const selectExperience = (event) => {
        setSelectedExperience(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredApplications = applicationList.filter(application => 
        application.applicantFullName.toLowerCase().includes(searchQuery) ||
        application.email.toLowerCase().includes(searchQuery)
    );

    if (loading) {
        return <div className="text-center mt-4 text-blue-500">Loading applications...</div>;
    }

    if (error) {
        return <div className="text-center mt-4 text-red-500">{error}</div>;
    }

    return (
        <div className='container mx-auto min-h-screen p-4'>
            <div className='text-2xl font-semibold text-blue-500 my-4'>
                Received Applications
            </div>
            <div className='flex flex-col md:flex-row justify-between w-full max-w-screen-lg'>
                <div className="w-full md:w-1/3 m-1 p-2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search by Name or Email</label>
                    <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter name or email"
                    />
                </div>
                <div className="w-full md:w-1/3 m-1 p-2">
                    <label htmlFor="positions" className="block text-sm font-medium text-gray-700">Choose Position</label>
                    <select
                        id="positions"
                        name="selectedPosition"
                        value={selectedPosition}
                        onChange={selectPosition}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">Select Position</option>
                        {totalPositions.map((position, index) => (
                            <option key={index} value={position}>{position}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-1/3 m-1 p-2">
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Choose Experience Level</label>
                    <select
                        id="experience"
                        name="selectedExperience"
                        value={selectedExperience}
                        onChange={selectExperience}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">Select Experience Level</option>
                        {totalExperienceType.map((level, index) => (
                            <option key={index} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Is seen</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO.</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Highest Education</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Degree Name</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Applied for</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Experience Type</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Accepted</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredApplications.slice().reverse().map((application, index) => (
                            (selectedExperience.length === 0 || selectedExperience === application.experienceType) &&
                            (selectedPosition.length === 0 || selectedPosition === application.jobModel.jobTitle) && (
                                <tr
                                    key={application.applicantId}
                                    className="hover:bg-gray-50 transition ease-in-out duration-150"
                                >
                                    <td className={`${application.isSeen ? "text-green-600" : "text-red-600"} px-6 py-4 text-center whitespace-nowrap`}>
                                        <span className='font-semibold text-xl'>{application.isSeen ? "Seen" : "New"}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">{index + 1}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">{application.applicantFullName}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">{application.highestEducation}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">{application.degreeName}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">{application.jobModel.jobTitle}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">{application.experienceType}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <NavLink to={`/application/${application.applicantId}`} className="text-blue-600 hover:underline">
                                            View Application
                                        </NavLink>
                                    </td>
                                    <td className={`px-6 py-4 text-center whitespace-nowrap ${application.isAccepted ? "text-green-600" : "text-red-600"}`}>{application.isAccepted ? "Accepted" : "Rejected"}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default ApplicantList;
