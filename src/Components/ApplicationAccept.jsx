import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';  // Import for animations
import { useAuth } from '../Authorisation/AuthContext';

function ApplicationAccept(props) {
    const { url, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        interviewDate: '',
        interviewTime: '',
        applicationId: props.id
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData.applicationId)
        setLoading(true);
        try {
            const response = await axios.post(`${url}/application/accept`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log('Form Data:', response.data);
            toast.success("Application accepted and confirmation email sent to applicant");
            setTimeout(() => {
                props.handleClose();
            }, 3000);
        } catch (error) {
            console.error('Error accepting application:', error);
            toast.error("Failed to accept the application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center text-green-800">Interview Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="interviewDate" className="block text-gray-700 font-semibold mb-2">Interview Date</label>
                        <input
                            type="date"
                            id="interviewDate"
                            name="interviewDate"
                            value={formData.interviewDate}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="interviewTime" className="block text-gray-700 font-semibold mb-2">Interview Time</label>
                        <input
                            type="time"
                            id="interviewTime"
                            name="interviewTime"
                            value={formData.interviewTime}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div className="flex justify-center">
                        {loading ? (
                            <div role="status" className="flex items-center space-x-2">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="text-gray-500">Loading...</span>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ApplicationAccept;
