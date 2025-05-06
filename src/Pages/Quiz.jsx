import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../Authorisation/AuthContext";
import loader from "../assets/Images/loaderQu.gif";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaUserTie, FaClock, FaCheckCircle, FaTimesCircle, FaForward } from 'react-icons/fa';
import { MdOutlineScore, MdOutlineQuiz } from 'react-icons/md';

const Quiz = () => {
  // State declarations
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [selectedAnswersList, setSelectedAnswersList] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const { setIsDisabled, url, token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestion] = useState(false);
  const [roles, setRoles] = useState([]);
  const [responseData, setResponseData] = useState({
    userName: "",
    email: "",
    scoreOfCandidate: 0,
    quizDate: "",
    quizEndTime: "",
    quizStartTime: "",
  });
  const [scoreData, setScoreData] = useState({
    userName: "",
    email: "",
    scoreOfCandidate: 0,
    quizStartTime: "",
    quizEndTime: "",
    role: "",
  });
  const [quizStarted, setQuizStarted] = useState(false);
  const [timer, setTimer] = useState(5400); // 90 minutes in seconds
  const [isAgreed, setIsAgreed] = useState(false);

  // Helper function to get role name by ID
  const getRoleNameById = (roleId) => {
    const role = roles.find((r) => r.roleId == roleId);
    return role ? role.roleName : "Unknown Role";
  };

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${url}/role/getRoles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles. Please refresh the page.");
    }
  };

  // Fetch questions based on selected role
  const fetchQuestionsByRole = async () => {
    if (!scoreData.role || scoreData.role <= 0) {
      console.warn("Invalid role:", scoreData.role);
      setLoadingQuestion(false);
      return;
    }

    setLoadingQuestion(true);
    try {
      const response = await axios.get(
        `${url}/question/getQuestions/${scoreData.role}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(response.data);
      setSelectedAnswersList(new Array(response.data.length).fill({}));
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions. Please try again.");
    } finally {
      setTimeout(() => setLoadingQuestion(false), 3000);
    }
  };

  // Modal handlers
  const openGuidelines = () => {
    document.getElementById("guidelines").showModal();
  };

  const closeGuidelines = () => {
    document.getElementById("guidelines").close();
  };

  const handleCheckboxChange = () => {
    setIsAgreed(!isAgreed);
  };

  // Handle page reload/close confirmation
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (quizStarted && !showResult) {
        event.preventDefault();
        Swal.fire({
          title: "Are you sure?",
          text: "Reloading the page will end your quiz and submit your current progress. Do you want to continue?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, reload",
          cancelButtonText: "No, stay",
        }).then((result) => {
          if (result.isConfirmed) {
            const currentTime = new Date();
            const formattedTime = `${currentTime
              .getHours()
              .toString()
              .padStart(2, "0")}:${currentTime
              .getMinutes()
              .toString()
              .padStart(2, "0")}:${currentTime
              .getSeconds()
              .toString()
              .padStart(2, "0")}`;
            submitResult(formattedTime);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.location.reload();
          }
        });
        event.returnValue = "";
      }
    };

    if (quizStarted && !showResult) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [quizStarted, showResult]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (quizStarted && timer > 0 && !showResult) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
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

  // Update score in scoreData when score changes
  useEffect(() => {
    setScoreData((prev) => ({
      ...prev,
      scoreOfCandidate: score,
    }));
  }, [score]);

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch questions when role changes
  useEffect(() => {
    fetchQuestionsByRole();
  }, [scoreData.role]);

  // Load previous answer when navigating
  useEffect(() => {
    if (questions.length > 0 && selectedAnswersList[currentQuestionIndex]) {
      const prevAnswer = selectedAnswersList[currentQuestionIndex];
      if (prevAnswer.text) {
        const index = questions[currentQuestionIndex].answers.findIndex(
          (ans) => ans.text === prevAnswer.text
        );
        setSelectedAnswerIndex(index);
        setSelectedAnswer(prevAnswer);
      } else {
        setSelectedAnswerIndex(null);
        setSelectedAnswer({});
      }
    }
  }, [currentQuestionIndex, selectedAnswersList, questions]);

  // Submit quiz results to API
  const submitResult = async (endTime) => {
    try {
      const response = await axios.post(
        `${url}/candidate/addScore`,
        {
          userName: scoreData.userName,
          email: scoreData.email,
          scoreOfCandidate: score,
          quizStartTime: scoreData.quizStartTime,
          role: scoreData.role,
          quizEndTime:
            endTime ||
            new Date().toLocaleTimeString("en-US", { hour12: false }),
          correctAnswers: correctAnswers,
          incorrectAnswers: incorrectAnswers,
          skipped: skippedQuestions,
          totalAttempted: correctAnswers + incorrectAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponseData(response.data);
      toast.success("Congratulations! Your test is completed");
    } catch (e) {
      if (e.message === "Request failed with status code 500") {
        toast.error("You have already given the test");
      } else {
        toast.error("Some error occurred. Please contact the invigilator.");
      }
    }
  };

  // Start quiz handler
  const handleStart = async () => {
    closeGuidelines();
    try {
      const response = await axios.get(
        `${url}/user/checkEmail/${scoreData.email}`
      );
      if (!response.data) {
        setIsDisabled(true);
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleTimeString("en-US", {
          hour12: false,
        });

        setScoreData({
          ...scoreData,
          quizStartTime: formattedTime,
        });
        if (scoreData.userName.trim() && scoreData.email.trim()) {
          setQuizStarted(true);
          setScore(0);
          setCorrectAnswers(0);
          setIncorrectAnswers(0);
          setSkippedQuestions(0);
          setSelectedAnswerIndex(null);
          setCurrentQuestionIndex(0);
          setShowResult(false);
          setSelectedAnswersList(new Array(questions.length).fill({}));
          setSelectedAnswer({});
          setTimer(5400); // Reset timer to 90 minutes
        }
      } else {
        toast.info("This email already exists. Use a different email.");
      }
    } catch (e) {
      toast.error("Some error occurred. Please refresh the page.");
    }
  };

  // Update score based on selected answers
  const updateScore = (newAnswers) => {
    let newScore = 0;
    let newCorrect = 0;
    let newIncorrect = 0;
    let newSkipped = 0;

    newAnswers.forEach((answer) => {
      if (answer.correct === true) {
        newScore += 1;
        newCorrect += 1;
      } else if (answer.correct === false) {
        newScore -= 0.25;
        newIncorrect += 1;
      } else {
        newSkipped += 1;
      }
    });

    setScore(newScore);
    setCorrectAnswers(newCorrect);
    setIncorrectAnswers(newIncorrect);
    setSkippedQuestions(newSkipped);
  };

  // Move to next question
  const handleNextQuestion = () => {
    const newAnswers = [...selectedAnswersList];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setSelectedAnswersList(newAnswers);
    updateScore(newAnswers);

    setSelectedAnswerIndex(null);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setShowResult(true);
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleTimeString("en-US", {
        hour12: false,
      });
      submitResult(formattedTime);
    }
    setSelectedAnswer({});
    console.log(newAnswers);
  };

  // Move to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newAnswers = [...selectedAnswersList];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setSelectedAnswersList(newAnswers);
      updateScore(newAnswers);

      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswerIndex(null);
      setSelectedAnswer({});
    }
  };

  // Skip question handler
  const handleSkipQuestion = () => {
    const newAnswers = [...selectedAnswersList];
    newAnswers[currentQuestionIndex] = {};
    setSelectedAnswersList(newAnswers);
    updateScore(newAnswers);

    setSelectedAnswerIndex(null);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setShowResult(true);
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleTimeString("en-US", {
        hour12: false,
      });
      submitResult(formattedTime);
    }
    setSelectedAnswer({});
  };

  // Select answer handler
  const handleSelectAnswer = (index, answer) => {
    setSelectedAnswerIndex(index);
    setSelectedAnswer(answer);
  };

  // Format time display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formatted = [
      hrs > 0 ? `${hrs}`.padStart(2, "0") : null,
      `${mins}`.padStart(2, "0"),
      `${secs}`.padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");

    return formatted;
  };

  // Close quiz confirmation
  const handleClose = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Closing will end your quiz and submit your current progress.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit",
      cancelButtonText: "No, continue",
    }).then((result) => {
      if (result.isConfirmed) {
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleTimeString("en-US", {
          hour12: false,
        });
        submitResult(formattedTime);
        setShowResult(true);
      }
    });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-b from-blue-100 to-blue-50 min-h-screen">
      {!quizStarted ? (
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 text-center transform transition-all duration-300 ">
          <h1 className="text-3xl font-extrabold mb-6 text-blue-600">
            Welcome to the Quiz
          </h1>
          <input
            type="text"
            value={scoreData.userName}
            name="userName"
            onChange={(e) =>
              setScoreData((prev) => ({ ...prev, userName: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            placeholder="Your Name"
          />
          <input
            type="email"
            value={scoreData.email}
            onChange={(e) =>
              setScoreData((prev) => ({ ...prev, email: e.target.value }))
            }
            name="email"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            placeholder="Your Email"
          />
          <select
            value={scoreData.role}
            onChange={(e) =>
              setScoreData((prev) => ({ ...prev, role: e.target.value }))
            }
            name="role"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          >
            <option value="" disabled>
              Select your Role
            </option>
            {roles.map((role, index) => (
              <option key={index} value={role.roleId}>
                {role.roleName}
              </option>
            ))}
          </select>

          <button
            onClick={openGuidelines}
            className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={
              !(scoreData.userName.length > 0 && scoreData.email.length > 0)
            }
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          {!showResult ? (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="w-full max-w-3xl min-h-[600px] bg-white shadow-2xl rounded-2xl p-8 relative flex flex-col">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-500 hover:bg-gray-200 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center transition-all"
                >
                  ×
                </button>

                <div className="flex justify-between items-center mb-6">
                  <p className="text-lg font-semibold text-gray-700">
                    Question {currentQuestionIndex + 1} of {questions?.length}
                  </p>
                  <div className="bg-green-50 text-sm px-4 py-2 rounded-lg font-semibold text-green-800 shadow-sm">
                    <p>
                      {timer > 0 ? (
                        <>
                          Time Left:{" "}
                          <span className="font-bold">{formatTime(timer)}</span>
                        </>
                      ) : (
                        "Time's up!"
                      )}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) / questions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex-1 border border-gray-100 p-6 bg-gray-50 rounded-xl shadow-inner">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {currentQuestionIndex + 1}.{" "}
                      {questions[currentQuestionIndex]?.question}
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {questions[currentQuestionIndex]?.answers.map(
                      (answer, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectAnswer(index, answer)}
                          className={`py-4 px-6 rounded-lg text-lg font-medium transition-all duration-200 text-left ${
                            selectedAnswerIndex === index
                              ? "bg-green-100 border-2 border-green-400 text-green-800 shadow-md"
                              : "bg-white border border-gray-200 text-gray-800 hover:bg-blue-50 hover:border-blue-300"
                          }`}
                        >
                          {answer.text}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-4 justify-between">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`py-2 px-6 text-white font-semibold rounded-lg transition-all shadow-md ${
                      currentQuestionIndex === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    Previous Question
                  </button>
                  <div className="flex gap-4">
                    <button
                      onClick={handleSkipQuestion}
                      className="py-2 px-6 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-all shadow-md"
                    >
                      {currentQuestionIndex + 1 === questions.length
                        ? "Skip and Submit"
                        : "Skip Question"}
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswerIndex === null}
                      className={`py-2 px-6 text-white font-semibold rounded-lg transition-all shadow-md ${
                        selectedAnswerIndex === null
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {currentQuestionIndex + 1 === questions.length
                        ? "Submit Quiz"
                        : "Next Question"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-8 text-center transition-all duration-300 border border-gray-100">
              {/* Header with decorative elements */}
              <div className="relative mb-8">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <MdOutlineQuiz className="h-12 w-12 text-blue-600 bg-white p-2" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Quiz Results
              </h2>
              <p className="text-gray-500 mb-8">Your performance summary</p>

              {/* Score display with improved circular progress */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <MdOutlineScore className="text-blue-500 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-600">
                      Score
                    </h3>
                  </div>
                  <p className="text-4xl font-bold text-blue-600">
                    {score.toFixed(2)}
                    <span className="text-2xl text-gray-500">
                      /{questions.length}
                    </span>
                  </p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(score / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
                    <svg
                      className="absolute w-full h-full"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeDasharray={`${
                          (score / questions.length) * 283
                        } 283`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {((score * 100) / questions.length).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User details with icons */}
              <div className="text-left space-y-5 mb-8">
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      User Name
                    </p>
                    <p className="text-lg text-gray-900">
                      {responseData.userName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg text-gray-900">
                      {responseData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaUserTie className="text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Selected Role
                    </p>
                    <p className="text-lg text-gray-900">
                      {getRoleNameById(scoreData.role)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaClock className="text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Test Duration
                    </p>
                    <p className="text-lg text-gray-900">
                      {responseData.quizStartTime} - {responseData.quizEndTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Correct
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {correctAnswers}
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FaTimesCircle className="text-red-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Incorrect
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {incorrectAnswers}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FaForward className="text-yellow-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Skipped
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {skippedQuestions}
                  </p>
                </div>
              </div>

              {/* Additional decorative elements */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Thank you for completing the quiz!
                </p>
              </div>
            </div>
          )}
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
      <dialog
        id="guidelines"
        className="backdrop:backdrop-blur-2xl bg-transparent"
      >
        <div className="max-w-3xl w-full bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Quiz Examination Guidelines
            </h1>
            <button
              onClick={closeGuidelines}
              className="text-gray-500 hover:bg-gray-200 text-2xl rounded-full w-10 h-10 flex items-center justify-center transition-all"
            >
              ×
            </button>
          </div>

          <div className=" pr-4">
            <p className="text-gray-700 mb-6 text-lg">
              Please read the following instructions carefully before starting
              the quiz. Ensure that you fully understand the rules to optimize
              your performance.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "1. Number of Questions",
                  content:
                    "The quiz contains a total of 100 questions. Answering all questions is not mandatory, and you may skip any question that you are unsure about.",
                  highlight: "100 questions",
                },
                {
                  title: "2. Scoring System",
                  content: [
                    "You will earn +1 point for every correct answer.",
                    "A penalty of -0.25 points will be applied for each incorrect answer (negative marking).",
                    "There will be no deduction for skipped questions.",
                  ],
                  type: "list",
                },
                {
                  title: "3. Navigation Rules",
                  content:
                    "You can navigate between questions using the Previous and Next buttons. Review your answers carefully before submitting.",
                  highlight: "Previous and Next buttons",
                },
                {
                  title: "4. Time Limit",
                  content:
                    "You have a total of 90 minutes to complete the quiz. The timer will be visible on the screen.",
                  highlight: "90 minutes",
                },
                {
                  title: "5. Exam Tips",
                  content: [
                    "Read each question thoroughly before selecting an answer.",
                    "Skipping questions that you are unsure about is better than losing marks due to incorrect answers.",
                    "Pay close attention to the time, and aim to answer the easier questions first.",
                  ],
                  type: "list",
                },
                {
                  title: "6. Preparation Instructions",
                  content:
                    "Ensure you are in a quiet environment with a stable internet connection before starting the quiz. Keep all necessary materials ready.",
                },
              ].map((section, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    {section.title}
                  </h2>
                  {section.type === "list" ? (
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-lg">
                          {item.includes("+1 point") ? (
                            <>
                              You will earn{" "}
                              <span className="font-bold text-green-600">
                                +1 point
                              </span>{" "}
                              for every correct answer.
                            </>
                          ) : item.includes("-0.25 points") ? (
                            <>
                              A penalty of{" "}
                              <span className="font-bold text-red-600">
                                -0.25 points
                              </span>{" "}
                              will be applied for each incorrect answer.
                            </>
                          ) : (
                            item
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-gray-600">
                      {section.content.includes(section.highlight) ? (
                        <>
                          {section.content.split(section.highlight)[0]}
                          <span className="font-bold text-blue-600">
                            {section.highlight}
                          </span>
                          {section.content.split(section.highlight)[1]}
                        </>
                      ) : (
                        section.content
                      )}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center mt-8 mb-6">
            <input
              type="checkbox"
              id="terms"
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3 cursor-pointer"
              checked={isAgreed}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="terms" className="text-gray-700 text-lg">
              I agree to the terms and conditions
            </label>
          </div>

          <div className="flex justify-center mt-6">
            {loadingQuestions ? (
              <div className="flex items-center justify-center py-3">
                <span className="text-gray-600 mr-3 text-lg">
                  Loading questions
                </span>
                <img className="h-8" src={loader} alt="Loading..." />
              </div>
            ) : (
              <button
                className={`w-full py-3 px-8 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md ${
                  isAgreed
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleStart}
                disabled={!isAgreed || loadingQuestions}
              >
                Start the Quiz
              </button>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Quiz;
