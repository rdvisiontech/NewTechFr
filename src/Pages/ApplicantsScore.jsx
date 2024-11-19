import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Authorisation/AuthContext';


function ApplicantsScore() {
    const { url, token } = useAuth();
    const [applicantList, setApplicantList] = useState([]);
    const [filteredApplicants, setFilteredApplicants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadApplicants();
    }, []);

    useEffect(() => {
        filterApplicants();
    }, [searchQuery, applicantList]);

    const loadApplicants = async () => {
        try {
            const response = await axios.get(`${url}/candidate/getAllCandidates`, {
                headers: {
                   "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loginDetails")).token}`
                }
            });
            toast.info("Quiz result loaded")
            setApplicantList(response.data);
        } catch (error) {
            toast.error('Failed to load applicants. Please try again later.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };


    const filterApplicants = () => {
        const filtered = applicantList.filter(applicant =>
            applicant.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredApplicants(filtered);
    };

    return (
        <div className="p-6 bg-blue-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-[#1462dd] text-center">Applicants Scores</h1>
    
            {/* Single Filter */}
            <div className="mb-6 flex justify-center items-center">
                <input
                    type="text"
                    placeholder="Filter by Name or Email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full md:w-1/3"
                />
            </div>
    
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-[#1462dd] text-white">
                            <th className="py-3 px-4 border-b text-center">Name</th>
                            <th className="py-3 px-4 border-b text-center">Email</th>
                            <th className="py-3 px-4 border-b text-center">Role</th>
                            <th className="py-3 px-4 border-b text-center">Quiz Date</th>
                            <th className="py-3 px-4 border-b text-center">Quiz Start Time</th>
                            <th className="py-3 px-4 border-b text-center">Quiz End Time</th>
                            <th className="py-3 px-4 border-b text-center">Toteal Attempted</th>
                            <th className="py-3 px-4 border-b text-center">Total Correct</th>
                            <th className="py-3 px-4 border-b text-center">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplicants.slice().reverse().map(applicant => (
                            <tr key={applicant.id} className='bg-blue-50 hover:bg-blue-100'>
                                <td className="py-3 px-4 border-b text-center">{applicant.userName}</td>
                                <td className="py-3 px-4 border-b text-center">{applicant.email}</td>
                                <td className="py-3 px-4 border-b text-center">{applicant.roleName?applicant.roleName:"NA"}</td>
                                <td className="py-3 px-4 border-b text-center">{applicant.quizDate}</td>
                                <td className="py-3 px-4 border-b text-center">{applicant.quizStartTime}</td>
                                <td className="py-3 px-4 border-b text-center">{applicant.quizEndTime}</td>
                                <td className="py-3 px-4 border-b text-center">{applicant.totalAttempted}</td>
                                <td className="py-3 px-4 border-b text-center">{ applicant.correctAnswers && applicant.correctAnswers}</td>
                                <td
                                    className={`py-3 px-4 border-b text-center ${
                                        applicant.scoreOfCandidate < 20 ? 'text-red-600' : ''
                                    }`}
                                >
                                    {applicant.scoreOfCandidate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    
            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
    
}

export default ApplicantsScore;
