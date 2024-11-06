import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApplicationAccept from '../Components/ApplicationAccept';
import { useAuth } from '../Authorisation/AuthContext';
// import closeIcon from '../Assests/closeButton.jpg';
import closeIcon from '../assets/Images/closeButton.jpg'
import Swal from 'sweetalert2';


function ViewApplication() {
    const { id } = useParams();
    const { url, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [application, setApplication] = useState({});
    const [loadingRejection, setLoadingRejection] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null)
    const [videoUrl, setVideoUrl] = useState(null)

    useEffect(() => {
        loadApplication();
    }, []);
    // Function to convert Base64 back to PDF
    const handleBase64ToPDF = (base64String) => {
        if (base64String) {
            try {
                const byteCharacters = atob(base64String);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
    
                setPdfUrl(url);
    
                // Cleanup function to revoke URL when no longer needed
                return () => URL.revokeObjectURL(url);
    
            } catch (error) {
                alert('Invalid Base64 string.');
            }
        } else {
            alert('No Base64 string available to convert.');
        }
    };
    
    // Function to convert Base64 back to Video
    const handleBase64ToVideo = async (videoBase64) => {
        if (videoBase64) {
            try {
                const { blob } = await convertBase64ToVideo(videoBase64);
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
            } catch (error) {
                console.error('Error converting Base64 to Video:', error);
                alert('An error occurred during the conversion process.');
            }
        } else {
            alert('No Base64 string available to convert.');
        }
    };
    // Function to convert Base64 to Video
    const convertBase64ToVideo = (base64String, fileName = 'video.mp4', mimeType = 'video/mp4') => {
        return new Promise((resolve, reject) => {
            try {
                const binaryString = atob(base64String);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: mimeType });
                const file = new File([blob], fileName, { type: mimeType });
                resolve({ blob, file });
            } catch (error) {
                reject(error);
            }
        });
    };

    const loadApplication = async () => {
      if(id){
        setLoading(true);
        try {
            const response = await axios.get(`${url}/application/getApplicationById/${id}`, {
                headers: {
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loginDetails")).token}`
                }
            });
            setApplication(response.data);
            setTitle(response.data.jobModel.jobTitle);
        } catch (error) {
            console.error("Error fetching application data:", error);
        } finally {
            setLoading(false);
        }
      }
    };

    const handleAccept = () => {
        document.getElementById("accept_form").showModal(); // Opens the dialog
    };

    const handleClose = () => {
        document.getElementById("accept_form").close(); // Closes the dialog
    };

    const handleReject = async () => {
        setLoadingRejection(true);
        try {
            const response = await axios.get(`${url}/application/reject/${id}`, {
                headers: {
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("loginDetails")).token}`
                }
            });
      
            Swal.fire("Application Rejected");
        } catch (error) {
           Swal.fire("Error rejecting application");
        }
            setLoadingRejection(false);
       
    };
    const handleVideo = () => {
        handleBase64ToVideo(application.introVideo)
        openVideoDialog()
    }
    const openVideoDialog = () => {
        document.getElementById("video").showModal()
    }
    const closeVideoModal = () => {
        document.getElementById("video").close()
    }
    const handlePDF = (stringBase64) => {
        handleBase64ToPDF(stringBase64)
        openPdfDialog()
    }
    const openPdfDialog = () => {
        document.getElementById("pdf").showModal()
    }
    const closePdfModal = () => {
        document.getElementById("pdf").close()
    }
    return (
        <div className="py-8 px-4 bg-gray-100 min-h-screen transition-all ease-in-out duration-300">
            {localStorage.getItem("loginDetails") ? (
                <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden ">
                    <div className="py-4 px-6">
                        <h2 className="text-2xl font-bold mb-4 text-green-800 text-center">Application Details</h2>
                        {loading ? (
                            <div className='w-full flex justify-center py-10'>
                                {/* <img src={loader} alt="Loading..." /> */}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 transition-transform transform hover:scale-105">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Personal Information</h3>
                                    <ul className="divide-y divide-gray-200">
                                        <ListItem label="Candidate Name" value={application.applicantFullName} />
                                        <ListItem label="Mobile Number" value={application.mobileNumber} />
                                        <ListItem label="Email Id" value={application.email} />
                                        <ListItem label="College Name" value={application.collegeName} />
                                        <ListItem label="10th Percentage" value={application.highSchoolPercentage} />
                                        <ListItem label="12th Percentage" value={application.twelfthPercentage} />
                                        <ListItem label="Graduation Year" value={application.graduationYear} />
                                        <ListItem label="Highest Education" value={application.highestEducation} />
                                        <ListItem label="Degree Name" value={application.degreeName} />
                                        <ListItem label="CGPA in Graduation" value={application.cgpaGraduation} />
                                        <ListItem label="Applied For" value={title} />
                                        <ListItem label="Date of Application" value={application.dateOfApplication} />
                                    </ul>
                                </div>

                                {/* Right Column */}
                                <div className="transition-transform transform hover:scale-105">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Application Details</h3>
                                    <ul className="divide-y divide-gray-200">
                                        <ListItem label="Experience Level" value={application.experienceType} />
                                        <ListItem
                                            label="Resume Link"
                                            value={<button onClick={() => handlePDF(application.resume)} className="text-blue-500 hover:text-blue-700">View Resume</button>}
                                        />
                                        <ListItem
                                            label="Intro Video Link"
                                            value={<button onClick={handleVideo} className="text-blue-500 hover:text-blue-700">View Intro video</button>}
                                        />
                                        <ListItem
                                            label="Portfolio Link"
                                            value={
                                                <a
                                                    href={application.portfolio}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <button className="text-blue-500 hover:text-blue-700">
                                                        View
                                                    </button>
                                                </a>
                                            }
                                        />

                                        <ListItem
                                            label="High School Certificate"
                                            value={<button onClick={() => handlePDF(application.highSchoolCertificate)} className="text-blue-500 hover:text-blue-700">View 10th Certificate</button>}
                                        />
                                        <ListItem
                                            label="Intermediate Certificate"
                                            value={<button onClick={() => handlePDF(application.intermediateCertificate)} className="text-blue-500 hover:text-blue-700">View 12th Certificate</button>}
                                        />
                                        <ListItem
                                            label="Graduation Certificate"
                                            value={<button onClick={() => handlePDF(application.graduationCertificate)} className="text-blue-500 hover:text-blue-700">View Graduation Certificate</button>}
                                        />
                                        <ListItem
                                            label="Salary Slip"
                                            value={<button onClick={() => handlePDF(application.salarySlip)} className="text-blue-500 hover:text-blue-700">View Salary Slip</button>}
                                        />
                                        <ListItem
                                            label="Experience Certificate"
                                            value={<button onClick={() => handlePDF(application.experienceCertificate)} className="text-blue-500 hover:text-blue-700">View Experience Certificate</button>}
                                        />

                                        <ListItem label="Experience in Years" value={application.experienceInYear} />
                                        <ListItem label="About Applicant" value={<p className="text-gray-700">{application.about}</p>} />
                                    </ul>
                                </div>

                            </div>
                        )}
                    </div>
                    {/* Buttons Section */}
                    <div className="flex justify-end space-x-4 py-4 px-6 bg-gray-50 border-t border-gray-200">
                        <button
                            onClick={handleAccept}
                            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                        >
                            Accept Application
                        </button>
                        {loadingRejection ? (
                            <div className="px-4 py-2 font-semibold rounded-lg transition-transform transform hover:scale-105 flex items-center">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.1353C74.2255 17.258 77.5217 19.7037 80.3878 22.5971C83.4316 25.5904 85.9461 29.1502 87.8295 33.1194C88.5036 35.4094 91.4946 36.4596 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </div>
                        ) : (
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105"
                            >
                                Reject Application
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className='w-full flex justify-center items-center py-10'>
                    <p className="text-red-500 font-semibold text-xl">Unauthorized Access</p>
                </div>
            )}

              {/* Accept Application Modal */}
              <dialog id="accept_form" className="modal rounded-lg shadow-lg p-4">
                <div className="modal-content">
                    <ApplicationAccept id={id} handleClose={handleClose} />
                </div>
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 p-2 text-gray-700 hover:text-gray-900"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </dialog>
            <dialog id='video'>

                {videoUrl && (
                    <div className="w-full max-w-lg ">
                        <div className="absolute top-2 right-2 cursor-pointer" style={{ zIndex: "15" }} onClick={closeVideoModal}>
                            <img src={closeIcon} className="h-5 w-5 hover:scale-105 transition-all" alt="close icon" />
                     
                        </div>
                        <video
                            src={videoUrl}
                            className=" rounded"
                            controls
                            title="Generated Video"
                        />
                    </div>)}

            </dialog>
            <dialog id='pdf'>
                {pdfUrl && (
                    <div className="w-full flex justify-center">
                        {/* Close button positioned above the PDF */}
                        <div className="absolute top-2 right-2 cursor-pointer" style={{ zIndex: "15" }} onClick={closePdfModal}>
                            <img src={closeIcon} className="h-5 w-5 hover:scale-105 transition-all" alt="close icon" />
                        </div>

                        {/* PDF in A4 size */}
                        <iframe
                            src={pdfUrl}
                            className="border border-gray-300 rounded"
                            title="Generated PDF"
                            style={{ width: '595px', height: '842px' }} // A4 size in pixels
                        />
                    </div>
                )}
            </dialog>

        </div>
    );
}

const ListItem = ({ label, value }) => (
    <li className="py-2">
        <span className="font-semibold text-gray-800">{label}:</span> {value}
    </li>
);

export default ViewApplication;
