import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../Authorisation/AuthContext';

const CareerLandingPage = () => {
    const [jobData, setJobsData] = useState([]);
    const { url, token } = useAuth();
    
    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const response = await axios.get(`${url}/jobs/getAllJobsPosted`);
            setJobsData(response.data.filter((job) => job.jobStatus === "Active"));
        } catch (error) {
            console.error("Error loading jobs:", error);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center">
            <header className="w-full bg-white text-gray-200 py-12 shadow-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto text-cente ">
                    <h1 className="text-5xl font-extrabold text-[#1462dd] animate-fadeIn">Join RDVISION</h1>
                    <p className="text-xl mt-3 text-[#1462dd] animate-fadeIn delay-100">Explore exciting career opportunities and be part of our innovative team.</p>
                </div>
            </header>

            <section className="mt-12 w-full px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-white text-gray-800 shadow-lg rounded-lg p-8 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 animate-fadeIn">
                        {/* <img src={cr} alt="Why Work With Us" className="w-full rounded-lg mb-4" /> */}
                        <h2 className="text-3xl font-bold text-[#1462dd] mb-4">Why Work With Us?</h2>
                        <p className="text-gray-600 mb-6">
                            At RDVISION, we value innovation, collaboration, and personal growth. You'll have the opportunity to work with talented individuals in a dynamic environment.
                        </p>
                        <NavLink to="/about-us" className="text-[#1462dd] font-semibold hover:text-teal-400 transition duration-300">Learn More About Us &rarr;</NavLink>
                    </div>

                    <div className="bg-white text-gray-800 shadow-lg rounded-lg p-8 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 animate-fadeIn delay-100">
                        <img  alt="Our Values" className="w-full rounded-lg mb-4" />
                        <h2 className="text-3xl font-bold text-[#1462dd] mb-4">Our Values</h2>
                        <p className="text-gray-600 mb-6">
                            We are committed to creating a diverse and inclusive workplace. Our core values guide our decision-making and drive our company culture.
                        </p>
                        <NavLink to="/our-values" className="text-[#1462dd] font-semibold hover:text-teal-400 transition duration-300">Explore Our Values &rarr;</NavLink>
                    </div>
                </div>
            </section>

            <section id="open-positions" className="mt-20 w-full px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-extrabold text-center text-[#1462dd] mb-10 animate-fadeIn">Open Positions</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {jobData.length > 0 ? jobData.map((job, index) => (
                            <div key={index} className="bg-white text-gray-800 shadow-lg rounded-lg p-8 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100 animate-fadeIn">
                                <h3 className="text-2xl font-bold text-[#1462dd] mb-4">{job.jobTitle}</h3>
                                <p className="text-gray-600 mb-6">
                                    {job.jobDescription.slice(0, 100)}...
                                </p>
                                <NavLink to={`/job/${job.jobId}`} className="text-[#1462dd] font-semibold hover:text-teal-400 transition duration-300">Apply Now &rarr;</NavLink>
                            </div>
                        )) : (
                            <p className="text-gray-600 text-center animate-fadeIn">No active job openings at the moment. Please check back later.</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="mt-20 w-full bg-gray-100 text-gray-800 py-12">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold mb-4 text-[#1462dd] animate-fadeIn">Ready to Take the Next Step?</h2>
                    <p className="text-xl mb-6 text-[#1462dd] animate-fadeIn delay-100">Join our team and help shape the future at RDVISION.</p>
                    <NavLink to="/postedJobs" className="bg-[#1462dd] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-[#a03e53] transition duration-300 animate-fadeIn delay-200">
                        Apply Today
                    </NavLink>
                </div>
            </section>
        </div>
    );
};

export default CareerLandingPage;
