import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../Authorisation/AuthContext';
import loader from '../assets/Images/loaderQu.gif'

const Quiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [coreectAnswers, setCorrectAnswers] = useState(0)
    const [incorrectAnswers, setIncorrectAnswers] = useState(0)
    const [skippedquestions, setSkippedQuestions] = useState(0)
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [selectedAnswersList, setSelectedAnswersList] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const { setIsDisabled, url, token } = useAuth()
    const [questions, setQuestions] = useState()
    const [loadingQuestions, setLoadingQuestion] = useState(false)
    const [roles,setRoles]=useState(["sales","Frontend Developer","Backend Developer","Full Stack Developer"])
    const [responseData, setReaponseData] = useState({
        userName: "",
        email: "",
        scoreOfCandidate: 0,
        quizDate: "",
        quizEndTime: "",
        quizStartTime: "",
       


    })
    const [scoreData, setScoreData] = useState({
        userName: "",
        email: "",
        scoreOfCandidate: 0,
        quizStartTime: "",
        quizEndTime: "",
        role: "",
    });

    useEffect(() => {
        fetchQuestionsByRole()
    }, [scoreData.role])

    const fetchQuestionsByRole = async () => {
        if (scoreData.role > 0) {
            setLoadingQuestion(true)
            try {
                const response = await axios.get(`${url}/question/getQuestions/${scoreData.role}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                setQuestions(response.data);
                setLoadingQuestion(false)
            } catch (error) {
                console.error("Error fetching questions:", error);
                setLoadingQuestion(false)
            }
        } else {
            console.warn("Invalid role:", scoreData.role);
            setLoadingQuestion(false)
        }
    };

    const [quizStarted, setQuizStarted] = useState(false);
    const [timer, setTimer] = useState(5400); // 90 minutes in seconds
    const openGuidLiones = () => {
        document.getElementById("guidelines").showModal()
    }
    const closeGuidelines = () => {
        document.getElementById("guidelines").close()
    }
    const [isAgreed, setIsAgreed] = useState(false)
    const handleCheckboxChange = () => {
        setIsAgreed(!isAgreed)
    }
    useEffect(() => {
        let interval;
        if (quizStarted && timer > 0 && !showResult) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0 || showResult) {
            clearInterval(interval);
            if (timer === 0) {
                setShowResult(true);
                submitResult();
            }
        }
        return () => clearInterval(interval);
    }, [quizStarted, timer, showResult]);

    useEffect(() => {
        setScoreData((prev) => ({
            ...prev,
            scoreOfCandidate: score
        }));
    }, [score])
    const submitResult = async (endTime) => {
        try {
            const response = await axios.post(`${url}/candidate/addScore`, {
                userName: scoreData.userName,
                email: scoreData.email,
                scoreOfCandidate: scoreData.scoreOfCandidate,
                quizStartTime: scoreData.quizStartTime,
                role:scoreData.role,
                quizEndTime: endTime,
                correctAnswers:coreectAnswers,
                incorrectAnswers:incorrectAnswers,
                skipped:skippedquestions,
                totalAttempted:coreectAnswers+incorrectAnswers

            },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
            setReaponseData(response.data)
            toast.success("Congratulation ! your Test is completed ")
        } catch (e) {
            if (e.message === "Request failed with status code 500") {
                toast.error("You have already given the test");
            } else {
                toast.error("Some error occurred. Please contact the invigilator.");
            }

        }
    }

    const handleStart = async () => {
        closeGuidelines()
        try {
            const response = await axios.get(`${url}/user/checkEmail/${scoreData.email}`,).then((resp) => {

                if (!resp.data) {
                    setIsDisabled(true)
                    const currentTime = new Date();
                    const hours = currentTime.getHours().toString().padStart(2, '0');
                    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
                    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
                    const formattedTime = `${hours}:${minutes}:${seconds}`;

                    setScoreData({
                        ...scoreData,
                        quizStartTime: formattedTime
                    })
                    if (scoreData.userName.trim() && scoreData.email.trim()) {
                        setQuizStarted(true);
                        setScore(0);
                        setSelectedAnswerIndex(null);
                        setCurrentQuestionIndex(0);
                        setShowResult(false);
                        setSelectedAnswersList([]);
                        setSelectedAnswer({});
                        setTimer(5400); // Reset timer to 90 minutes
                    }
                } else {
                    toast.info("This email allredy exist use a different Email")
                }
            })
        } catch (e) {
            toast.error("Some Error Occurs Please Refresh the page")
        }


    };

    const handleNextQuestion = () => {
        setSelectedAnswersList(prevAnswers => [...prevAnswers, selectedAnswer]);
        if (selectedAnswer.correct) {
            setScore(score + 1);
            setCorrectAnswers((prev) => prev + 1)

        } else if (selectedAnswer.correct === false) {
            setScore(score - 0.25);
            setIncorrectAnswers((prev) => prev + 1)
        } else {
            setSkippedQuestions((prev) => prev + 1)
        }
        setSelectedAnswerIndex(null);
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
        } else {
            setShowResult(true);
            const currentTime = new Date();
            const hours = currentTime.getHours().toString().padStart(2, '0');
            const minutes = currentTime.getMinutes().toString().padStart(2, '0');
            const seconds = currentTime.getSeconds().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}:${seconds}`;
            submitResult(formattedTime);
        }
        setSelectedAnswer({})
    };

    const handleSelectAnswer = (index, answer) => {
        setSelectedAnswerIndex(index);
        setSelectedAnswer(answer);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };
    const timerClass = timer <= 120 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';

    return (
        <div className="flex flex-col items-center p-8 bg-blue-50 min-h-screen">
            {!quizStarted ? (
                <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
                    <h1 className="text-2xl font-bold mb-6 text-[#1462dd]">Enter Your Name</h1>
                    <input
                        type="text"
                        value={scoreData.userName}
                        name='userName'
                        onChange={(e) => setScoreData((prev) => ({ ...prev, userName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                        placeholder="Your Name"
                    />
                    <input
                        type="email"
                        value={scoreData.email}
                        onChange={(e) => setScoreData((prev) => ({ ...prev, email: e.target.value }))}
                        name='email'
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                        placeholder="Your Email"
                    />
                    <select
                        value={scoreData.role}
                        onChange={(e) => setScoreData((prev) => ({ ...prev, role: e.target.value }))}
                        name='email'
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                    >
                        <option value="" disabled>Select your Role</option>
                        <option value="1">Sales</option>
                        <option value="2">Forntend Developer</option>
                        <option value="3">Backend Developer</option>
                        <option value="4">Full-Stack Developer</option>

                    </select>

                    <button
                        onClick={openGuidLiones}
                        className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                        disabled={!(scoreData.userName.length > 0 && scoreData.email.length > 0)}
                    >
                        Start Quiz
                    </button>
                </div>
            ) : (
                <>
                    <div className={`absolute top-4 right-4 p-4 rounded-lg shadow-md ${timerClass}`}>
                        <p className="text-lg font-semibold">Time Left: {formatTime(timer)}</p>
                    </div>
                    <div className='text-xl font-semibold'>Number of Questions :- {questions.length}</div>
                    {!showResult ? (
                        <div className="w-full max-w-2xl  shadow-lg rounded-lg p-8 bg-blue-50">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">  {currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}</h2>
                            </div>
                            <div className="grid gap-4">
                                {questions[currentQuestionIndex].answers.map((answer, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectAnswer(index, answer)}
                                        className={`py-3 px-5 rounded-lg text-lg font-medium transition-colors ${selectedAnswerIndex === index
                                            ? answer.correct
                                                ? 'bg-green-100 border border-green-300 text-green-800'
                                                : 'bg-green-100 border border-green-300 text-green-800'
                                            : 'bg-gray-100 border border-gray-200 text-gray-800 hover:bg-blue-200'
                                            }`}
                                    >
                                        {answer.text}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleNextQuestion}
                                className="mt-8 py-3 px-5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Next question
                            </button>
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-10 text-center">
                            <h2 className="text-4xl font-extrabold text-gray-800 mb-6">Quiz Results</h2>
                            <div className="text-left">
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">User Name:</span>
                                    <span className="ml-3 text-lg text-gray-900">{responseData.userName}</span>
                                </div>
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">Email:</span>
                                    <span className="ml-3 text-lg text-gray-900">{responseData.email}</span>
                                </div>
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">Selected role:</span>
                                    <span className="ml-3 text-lg text-gray-900">{roles[scoreData.role-1]}</span>
                                </div>
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">Test Start Time:</span>
                                    <span className="ml-3 text-lg text-gray-900">{responseData.quizStartTime}</span>
                                </div>
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">Test End Time:</span>
                                    <span className="ml-3 text-lg text-gray-900">{responseData.quizEndTime}</span>
                                </div>
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">Total attempted:</span>
                                    <span className="ml-3 text-lg text-gray-900">{coreectAnswers+incorrectAnswers}</span>
                                </div>
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">Correct Answers:</span>
                                    <span className="ml-3 text-lg text-gray-900">{coreectAnswers}</span>
                                </div>
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">Incorrect Answers:</span>
                                    <span className="ml-3 text-lg text-gray-900">{incorrectAnswers}</span>
                                </div>
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">Skipped:</span>
                                    <span className="ml-3 text-lg text-gray-900">{skippedquestions}</span>
                                </div>
                                <div className="mb-6">
                                    <span className={`text-lg ${score>35?"text-green-900":"text-red-600"} font-bold`}>Your Score:</span>
                                    <span className={`ml-3 text-lg ${score>35?"text-green-900":"text-red-600"}`}>{score}</span>
                                </div>
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">Test Status :</span>
                                    <span className="ml-3 text-lg text-gray-900">Test Submitted</span>
                                </div>
                            </div>
                            {/* <button
                            onClick={handleStart}
                            className="mt-10 py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Restart Quiz
                        </button> */}
                        </div>


                    )}
                </>
            )}
            <ToastContainer />
            <dialog id='guidelines' className="bg-blue-50 h-full rounded-lg">
                <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-10">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
                        Quiz Examination Guidelines
                    </h1>
                    <p className="text-gray-700 text-base mb-6 font-sans">
                        Please read the following instructions carefully before starting the quiz. Ensure that you fully understand the rules to optimize your performance in the quiz.
                    </p>

                    {/* Section 1: Number of Questions */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 font-serif">1. Number of Questions:</h2>
                        <p className="text-gray-600 font-sans">
                            The quiz contains a total of <span className="font-bold text-indigo-600">100 questions</span>.
                            Answering all questions is not mandatory, and you may skip any question that you are unsure about.
                        </p>
                    </div>

                    {/* Section 2: Scoring System */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 font-serif">2. Scoring System:</h2>
                        <ul className="list-disc list-inside text-gray-600 font-sans">
                            <li>You will earn <span className="font-bold text-green-600">+1 point</span> for every correct answer.</li>
                            <li>A penalty of <span className="font-bold text-red-600">-0.25 points</span> will be applied for each incorrect answer (negative marking).</li>
                            <li>There will be no deduction for skipped questions.</li>
                        </ul>
                    </div>

                    {/* Section 3: Navigation Rules */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 font-serif">3. Navigation Rules:</h2>
                        <ul className="list-disc list-inside text-gray-600 font-sans">
                            <li>Once you move to the next question, <span className="font-bold text-red-600">you cannot go back</span> to the previous one. Carefully review your answer before proceeding.</li>
                        </ul>
                    </div>

                    {/* Section 4: Time Limit */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 font-serif">4. Time Limit:</h2>
                        <p className="text-gray-600 font-sans">
                            You will have a total of <span className="font-bold text-indigo-600">90 minutes</span> to complete the quiz. The timer will be visible on the screen, so manage your time wisely.
                        </p>
                    </div>

                    {/* Section 5: Exam Tips */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 font-serif">5. Exam Tips:</h2>
                        <ul className="list-disc list-inside text-gray-600 font-sans">
                            <li>Read each question thoroughly before selecting an answer.</li>
                            <li>Skipping questions that you are unsure about is better than losing marks due to incorrect answers.</li>
                            <li>Pay close attention to the time, and aim to answer the easier questions first.</li>
                        </ul>
                    </div>

                    {/* Section 6: Preparation Instructions */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 font-serif">6. Preparation Instructions:</h2>
                        <p className="text-gray-600 font-sans">
                            Ensure you are in a quiet environment with a stable internet connection before starting the quiz. Keep all necessary materials, such as paper and pen, ready for rough work.
                        </p>
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            id="terms"
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                            checked={isAgreed}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="terms" className="text-gray-600 font-sans">
                            I agree to the terms and conditions
                        </label>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center mt-8">
                        {loadingQuestions ? <div className=' flex justify-center items-center'><span>Loading questions please wait.... </span><img className='h-20' src={loader} alt="" /></div> : <button
                            className={`text-lg px-8 py-3 rounded-lg font-sans focus:outline-none focus:ring-4 focus:ring-indigo-300 ${isAgreed
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            onClick={handleStart}
                            disabled={!isAgreed}
                        >
                            Start the Quiz
                        </button>}
                    </div>
                </div>

            </dialog>

        </div>
    );
};

export default Quiz;
