import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../Authorisation/AuthContext';
import EditJob from '../Components/EditJob';

function PostedJobs() {
    const [jobsData, setJobsData] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedExperience, setSelectedExperience] = useState("");
    const { url } = useAuth();

    useEffect(() => {
        loadApplications();
    }, []);

    useEffect(() => {
        setSelectedExperience("");
    }, [selectedPosition]);

    const loadApplications = async () => {
        try {
            const response = await axios.get(`${url}/jobs/getAllJobsPosted`);
            if (localStorage.getItem("loginDetails")) {
                setJobsData(response.data);
            } else {
                setJobsData(response.data.filter((job) => job.jobStatus === "Active"));
            }
        } catch (error) {
            console.error("Error loading jobs:", error);
        }
    };

    const totalPositions = [...new Set(jobsData.map(job => job.jobTitle))];
    const totalExperienceType = [...new Set(jobsData
        .filter(job => selectedPosition === "" || selectedPosition === job.jobTitle)
        .map(job => job.experienceLevel)
    )];

    const openEditDialog = (jobId) => {
        document.getElementById("editBox").showModal();
    };

    const closeTheModel = () => {
        document.getElementById("editBox").close();
        loadApplications();
    };

    const handleActive = async (jobStatus, id) => {
        await axios.post(`${url}/jobs/updateJobStatus`, { jobStatus: jobStatus, jobId: id }, {
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loginDetails")).token}`
            }
        });
        loadApplications();
    };

    return (
        <div className='flex flex-col items-center h-screen p-4'>
            <div className='text-3xl font-bold text-[#1462dd]  mb-4 animate__animated animate__fadeIn'>Openings</div>
            <div className='flex flex-col md:flex-row justify-around w-full max-w-screen-lg mb-4'>
                <div className="w-full md:w-1/3 m-1 p-2">
                    <label htmlFor="positions" className="block text-sm font-medium text-gray-700">Choose Position</label>
                    <select id="positions" name="selectedPosition" value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-transform hover:scale-105">
                        <option value="">Select Position</option>
                        {totalPositions.map((position, index) => (
                            <option key={index} value={position}>{position}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full md:w-1/3 m-1 p-2">
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Choose Experience Level</label>
                    <select id="experience" name="selectedExperience" value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-transform hover:scale-105">
                        <option value="">Select Experience Level</option>
                        {totalExperienceType.map((level, index) => (
                            <option key={index} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='w-full overflow-x-auto'>
                <table className="w-full bg-white border border-gray-200 shadow-lg rounded-lg">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO.</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Experience Level</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum required education level</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Post</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            {localStorage.getItem("loginDetails") && <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Job Status</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {jobsData.slice().reverse().map((job, index) => (
                            (selectedExperience === "" || selectedExperience === job.experienceLevel) &&
                            (selectedPosition === "" || selectedPosition === job.jobTitle) && (
                                <tr key={job.jobId}>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">{index + 1}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">{job.jobTitle}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">{job.experienceLevel}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">{job.requiredDegree}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">16-07-2024</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap flex justify-around">
                                        <NavLink to={`/job/${job.jobId}`} className="transition-transform hover:scale-105 text-blue-600">View-Job</NavLink>
                                        {localStorage.getItem("loginDetails") &&
                                            <button onClick={() => openEditDialog(job.jobId)} className="transition-transform hover:scale-105 text-blue-600 ml-4">Edit-job</button>
                                        }
                                    </td>
                                    {localStorage.getItem("loginDetails") &&
                                        <td className={`px-6 py-4 text-center whitespace-nowrap font-semibold ${job.jobStatus === "Active" ? "text-green-500" : "text-red-500"}`}>
                                            <span
                                                onClick={() => handleActive(job.jobStatus, job.jobId)}
                                                className={`cursor-pointer px-4 py-2 ${job.jobStatus === "Active" ? "bg-blue-500" : "bg-red-500"} text-white rounded transition-transform ${job.jobStatus === "Active" ? "hover:scale-105" : "hover:scale-105"} active:bg-blue-700`}
                                            >
                                                {job.jobStatus}
                                            </span>
                                        </td>

                                    }
                                    <dialog id='editBox' className='rounded-lg p-4'>
                                        <div className='p-1 flex justify-end items-end'>
                                            {/* <img src={closeIcon} className='h-12 hover:scale-105 cursor-pointer' onClick={closeTheModel} alt="Close Icon" /> */}
                                        </div>
                                        <EditJob jobId={job.jobId} closeFunction={closeTheModel} />
                                    </dialog>
                                </tr>

                            )
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default PostedJobs;
