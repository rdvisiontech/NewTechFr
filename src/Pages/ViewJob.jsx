import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useAuth } from '../Authorisation/AuthContext';

function ViewJob() {
    const [job, setJob] = useState({});
    const { id } = useParams();  // Destructure jobId directly
    const [description, setDescription] = useState([]);
    const { url } = useAuth();

    useEffect(() => {
        loadJob();  // Load job on component mount
    }, []);

    // Function to fetch job details by jobId
    const loadJob = async () => {
        try {
            const response = await axios.get(`${url}/jobs/getJobById/${id}`);
            setJob(response.data);
            // Split job description by new lines for display
            setDescription(response.data.jobDescription.split("\n"));
        } catch (err) {
            console.error("Error loading job data: ", err);
        }
    };

    return (
        <div className='flex flex-col items-center px-4 py-5 md:px-8 lg:px-96'>
            {/* Job Title */}
            <div className='text-2xl font-medium mb-2 animate-fadeIn'>{job.jobTitle}</div>

            {/* Job Details */}
            <div className='text-left w-full'>
                <div className='text-sm text-gray-600 mb-2 animate-fadeIn delay-100'>
                    Post Date: {job.dateOfPost}
                </div>
                <div className='text-sm text-gray-600 mb-2 animate-fadeIn delay-200'>
                    Required Skills: {job.requiredSkills}
                </div>
                <div className='text-sm text-gray-600 mb-2 animate-fadeIn delay-300'>
                    Required Experience: {job.experienceLevel}
                </div>
                <div className='text-sm text-gray-600 mb-2 animate-fadeIn delay-400'>
                    Required Qualification: {job.requiredDegree}
                </div>

                {/* Job Description */}
                <div className='text-xl font-semibold mt-4 mb-2 animate-fadeIn delay-500'>
                    Job Description:
                </div>
            </div>

            {/* Display Job Description Line by Line */}
            <div className='text-sm text-gray-700 leading-6 text-justify animate-fadeIn delay-600'>
                {description.map((line, index) => (
                    <p key={index} className='mb-2'>
                        {/* If the line contains "should", make it bold */}
                        {line.includes('should') ? <strong>{line}</strong> : line}
                    </p>
                ))}
            </div>

            {/* Apply Button */}
            <div className='flex justify-center items-center w-full mt-6'>
                <NavLink
                    className='px-4 py-2 rounded-lg bg-blue-300 text-blue-800 font-semibold hover:bg-blue-500 hover:text-white transition-colors duration-300 ease-in-out'
                    to={`/apply/${job.jobId}`}
                >
                    Apply for this Job
                </NavLink>
            </div>
        </div>
    );
}

export default ViewJob;
