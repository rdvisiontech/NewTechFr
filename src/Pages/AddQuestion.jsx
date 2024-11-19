import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "../Authorisation/AuthContext";
import { toast, ToastContainer } from "react-toastify";

function AddQuestion() {
    const [selectRole, setSelectRole] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [addRole, setAddRole] = useState("");
    const { url } = useAuth()
    const token = JSON.parse(localStorage.getItem("loginDetails")).token
    const [roles, setRoles] = useState([
       
    ]);
    const [addQues, setAddQuestion] = useState(false);

    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState([
        { text: "", correct: true },
        { text: "", correct: false },
        { text: "", correct: false },
        { text: "", correct: false },
    ]);
    const [savedQuestions, setSavedQuestions] = useState([]);

    const getRoleName = (roleId) => {
        const role = roles.find(role => role.roleId === parseInt(roleId));
        return role ? role.roleName : null; // Return roleName if found, else null
    };

    const fetchRoles =async()=>{
        const response =await axios.get(`${url}/role/getRoles`,{
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json" // Ensure correct content type
            }
        })
        setRoles(response.data)
    }

    useEffect(()=>{
        fetchRoles()
    },[])
    const handleSelectChange = (value) => {
        setSelectRole(value);
        setAddQuestion(true);

    };

    const handleCloseModal = () => {
        setShowModal(false);
        setAddQuestion(false);
        setSelectRole("")
    };

    const handleAddRoleSave = () => {
       addNewRole()
    };

    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index][field] = value;
        setAnswers(updatedAnswers);
        if (field === "correct" && value) {
            updatedAnswers.forEach((answer, i) => {
                if (i !== index) answer.correct = false;
            });
            setAnswers(updatedAnswers);
        }
    };


    const handleSaveQuestion = () => {
        if (!question.trim()) {
            toast.error("Question cannot be empty.");
            return;
        }

        const newQuestion = {
            question: question.trim(),
            answers: answers,
            role: {
                roleId: selectRole
            }
        };


        setSavedQuestions([...savedQuestions, newQuestion]);
        setQuestion("");
        setAnswers([
            { text: "", correct: false },
            { text: "", correct: false },
            { text: "", correct: false },
            { text: "", correct: false },
        ]);
    };
    const handleSaveToDatabase = async () => {
       
        try {
            if (!token) {
                console.error('Authorization token is missing');
                toast.error('You must be logged in to save questions.');
                return;
            }

            if (!savedQuestions || savedQuestions.length === 0) {
                console.error('No questions to save');
                toast.error('Please add some questions before saving.');
                return;
            }

            const response = await axios.post(`${url}/question/add`, savedQuestions, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" // Ensure correct content type
                }
            });

            console.log('Response:', response.data);
            toast.success('Questions saved successfully!');
        } catch (error) {
            console.error('Error saving to database:', error);

            if (error.response) {
                // Server responded with an error
                console.error('Server error:', error.response.data);
                toast.error(`Server Error: ${error.response.data.message || 'Unable to save questions.'}`);
            } else if (error.request) {
                // No response received from the server
                console.error('No response received:', error.request);
                toast.error('Network error: No response from the server.');
            } else {
                // Something went wrong setting up the request
                console.error('Request setup error:', error.message);
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    const addNewRole = async () => {
        const response = await axios.post(`${url}/role/addrole`, {
            roleName: addRole
        },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" // Ensure correct content type
                }
            }
        )
        toast.success("Role Added")
        setShowModal(false)
        setSelectRole("")
        fetchRoles()
        
    }

    return (
        <>
            <div className="w-full flex justify-around items-center h-[55rem]">
                <div className="border text-center w-full md:w-1/2 p-4 rounded-md shadow-lg bg-white h-96">
                    <div className="flex flex-col text-left items-center ">
                        <label className="font-semibold">Select Role:</label>
                        <select
                            onChange={(e) => handleSelectChange(e.target.value)}
                            className="border capitalize p-2 w-1/2 mx-4 rounded-md"
                            name="role"
                        >
                            <option value="">Select Role</option>
                            {roles.map((role, index) => (
                                <option key={index} value={role.roleId}>
                                    {role.roleName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={() => setShowModal(true)} className="bg-gray-300 p-2 rounded mt-20 hover:bg-green-600 hover:text-white">Add New Role</button>
                </div>


            </div>

            {/* Add Role Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-[95%] md:w-1/3">
                        <h2 className="text-lg font-bold mb-4">Add New Role</h2>
                        <input
                            type="text"
                            placeholder="Enter Role Name"
                            value={addRole}
                            className="border px-3 py-2 w-full rounded-md mb-4"
                            onChange={(e) => setAddRole(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddRoleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Add 
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Question Area */}
            {addQues && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-[95%] md:w-1/2">
                        <div className="flex justify-between">
                            <div>
                                <span className="font-semibold bg-green-400 p-2 rounded-lg shadow-xl text-white capitalize ">{` ${getRoleName(selectRole)}`}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span>No of questions Added:</span>
                                <span className="rounded-full text-white bg-gray-600 h-10 w-10 flex justify-center items-center">
                                    {savedQuestions.length}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 rounded-sm">
                            <label htmlFor="question" className="block font-semibold">
                                Question:
                            </label>
                            <textarea
                                className="w-full border p-2"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            ></textarea>

                            {/* Answer Options */}
                            <div className="my-4 space-y-4">
                                <label htmlFor="answer" className="block font-semibold">
                                    Answer Options:
                                </label>

                                {answers.map((answer, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder={`${(index + 1) === 1 ? "enter only Correct answer in this Box" : `Enter answer  ${index + 1}  `}`}
                                            value={answer.text}
                                            onChange={(e) =>
                                                handleAnswerChange(index, "text", e.target.value)
                                            }
                                            className="border w-full py-1 px-2 rounded-md"
                                        />

                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center space-x-10">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-white bg-red-400 rounded-md hover:bg-red-600"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleSaveQuestion}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                            disabled={savedQuestions.length===0}
                                onClick={handleSaveToDatabase}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Add  all to database
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer/>
        </>
    );
}

export default AddQuestion