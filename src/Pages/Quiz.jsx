import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../Authorisation/AuthContext';

const Quiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [selectedAnswersList, setSelectedAnswersList] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const { setIsDisabled, url, token } = useAuth()
    const [responseData, setReaponseData] = useState({
        userName: "",
        email: "",
        scoreOfCandidate: 0,
        quizDate: "",
        quizEndTime: "",
        quizStartTime: ""

    })
    const [scoreData, setScoreData] = useState({
        userName: "",
        email: "",
        scoreOfCandidate: 0,
        quizStartTime: "",
        quizEndTime: ""
    });
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
    const questions = [
        {
            //Question 1
            question: 'The total combined customer lifetime values of all company’s customers s knownas-?',
            answers: [
                { text: 'Customer equity', correct: true },
                { text: 'Customer Lifetime value', correct: false },
                { text: 'Customer perceived value', correct: false },
                { text: 'Customer Share', correct: false }
            ]
        },
        {
            //Question 2
            question: 'The process of linking each item of expenditure to its justified purpose is known as-?',
            answers: [
                { text: 'Cost Analysis', correct: false },
                { text: 'Cost saving', correct: false },
                { text: 'Cost accounting', correct: true },
                { text: 'Value Analysis', correct: false }
            ]
        },

        {
            //Question 3
            question: 'Which type of leadership theories considers that the people inherit certain qualities that make them better suited to leadership?',
            answers: [
                { text: 'Learning theories', correct: false },
                { text: 'Trait theories', correct: true },
                { text: 'Behavioral theories', correct: false },
                { text: '‘Great Man’ theory', correct: false }
            ]
        },
        {
            //Question 4
            question: 'Records that to an agency’s financial transactions, such as budget, are called?',
            answers: [
                { text: 'Research Records', correct: false },
                { text: 'Legal Records', correct: false },
                { text: 'Fiscal Records', correct: true },
                { text: 'Electronic Records', correct: false }
            ]
        },
        {
            //Question 5
            question: 'What will be the result of a promising and over-delivering sales strategy?',
            answers: [
                { text: 'Full line sales', correct: false },
                { text: 'Happy customer', correct: true },
                { text: 'Customer dissatisfaction', correct: false },
                { text: 'Customer exchange', correct: false }
            ]
        },

        {
            //Question 6
            question: 'One of the major benefits of cross-selling is increase in-?',
            answers: [
                { text: 'Customer lifetime value (CLU)', correct: true },
                { text: 'Customer defection rate', correct: false },
                { text: 'Price of the product', correct: false },
                { text: 'Service cost', correct: false }
            ]
        },
        {
            //Question 7
            question: 'Front office CRM systems covering real-time aspects of sales-related activity are refered to as_?',
            answers: [
                { text: 'Automated Marketing', correct: false },
                { text: 'CRM customer communications', correct: false },
                { text: 'CRM customer services', correct: false },
                { text: 'Sales force automation', correct: true }
            ]
        },
        {
            //Question 8
            question: 'Sales forecasting involves-?',
            answers: [
                { text: 'Sales pricing', correct: false },
                { text: 'Sales planning', correct: true },
                { text: 'Distribution channel', correct: false },
                { text: 'Consumer Taster', correct: false }
            ]
        },

        {
            //Question 9
            question: 'Cross-Selling means?',
            answers: [
                { text: 'Selling with a cross face', correct: false },
                { text: 'Cross country marketing', correct: false },
                { text: 'Selling to friends', correct: false },
                { text: 'Selling to employees', correct: false },
                { text: 'Selling other products to existing customers', correct: true }
            ]
        },
        {
            //Question 10
            question: 'Good marketing is no accident, but a result of careful planning and_?',
            answers: [
                { text: 'Execution', correct: true },
                { text: 'Selling', correct: false },
                { text: 'Strategies', correct: false },
                { text: 'Research', correct: false }
            ]
        },
        {
            //Question 11
            question: 'What is the last stage of the consumer decision process-?',
            answers: [
                { text: 'Problem Recognition', correct: false },
                { text: 'Post purchase behavior', correct: false },
                { text: 'Alternative evaluation', correct: true },
                { text: 'Purchase', correct: false }
            ]
        },

        {
            //Question 12
            question: 'Marketing Mix is the most visible past of the marketing strategy of an organization?',
            answers: [
                { text: 'True', correct: true },
                { text: 'False', correct: false },

            ]
        },
        {
            //Question 13
            question: 'What is the basic property of a service which makes it different from a product.?',
            answers: [
                { text: 'Shape', correct: false },
                { text: 'Size', correct: false },
                { text: 'Very expensive', correct: false },
                { text: 'Intangibility', correct: true }
            ]
        },
        {
            //Question 14
            question: 'Which one of the following phrases reflects the marketing concept?',
            answers: [
                { text: 'The supplier is king in the market', correct: false },
                { text: 'Marketing should be viewed as hunting not gardening', correct: false },
                { text: 'This is what I make, won’t you please but it', correct: false },
                { text: 'This is what I want, won’t you please make it', correct: true }
            ]
        },

        {
            //Question 15
            question: 'The task of any business is to deliver _ at a profit?',
            answers: [
                { text: 'Customer need', correct: false },
                { text: 'Customer value', correct: true },
                { text: 'Product & Service', correct: false },
                { text: 'Improved quality', correct: false }
            ]
        },
        {
            //Question 16
            question: 'The solution to price competition is to develop a differentiated?',
            answers: [
                { text: 'Product, price and promotion', correct: false },
                { text: 'Offer, delivery and image', correct: true },
                { text: 'Package and label', correct: false },
                { text: 'International Website', correct: false }
            ]
        },
        {
            //Question 17
            question: 'AIDA stand for awareness, ____ Desire and _____?',
            answers: [
                { text: 'Interest: Action', correct: true },
                { text: 'Idea: Approach', correct: false },
                { text: 'Intensity: Appeal', correct: false },
                { text: 'Involvement: Appeal', correct: false }
            ]
        },

        {
            //Question 18
            question: 'Marketing id both an ‘art and a science’ there is constant tension between the formulated side of marketing and the _____ side?',
            answers: [
                { text: 'Creative', correct: true },
                { text: 'Sellings', correct: false },
                { text: 'Management', correct: false },
                { text: 'Behavior', correct: false }
            ]
        },
        {
            //Question 19
            question: '__________ pricing is the approach of setting a low initial price in order to attract alarge number of buyers quickly and win a large market share.?',
            answers: [
                { text: 'Market-Skimming', correct: false },
                { text: 'Value-Based', correct: false },
                { text: 'Market-Penetration', correct: true },
                { text: 'Under', correct: false }
            ]
        },
        {
            //Question 20
            question: 'What is the main folder on storage device called?',
            answers: [
                { text: 'Platform', correct: false },
                { text: 'Interface', correct: false },
                { text: 'Home Page', correct: false },
                { text: 'Root-Directory', correct: true }
            ]
        },

        {
            //Question 21
            question: 'Which of the following is not hardware of a computer?',
            answers: [
                { text: 'Monitor', correct: false },
                { text: 'Window', correct: true },
                { text: 'Processor', correct: false },
                { text: 'Printer', correct: false }
            ]
        },
        {
            //Question 22
            question: 'Storage capacity is frequently measured in?',
            answers: [
                { text: 'Hz', correct: false },
                { text: 'Byte', correct: true },
                { text: 'MIPS', correct: false },
                { text: 'Bps', correct: false }
            ]
        },
        {
            //Question 23
            question: 'Which device can understand the difference between data and programs?',
            answers: [
                { text: 'Input Device', correct: false },
                { text: 'Output Device', correct: false },
                { text: 'Microprocessor', correct: true },
                { text: 'None', correct: false }
            ]
        },

        {
            //Question 24
            question: 'Ctrl, Shift or del are known as?',
            answers: [
                { text: 'Modifier Keys', correct: true },
                { text: 'Control keys', correct: false },
                { text: 'Toggle keys', correct: false },
                { text: 'Function keys', correct: false }
            ]
        },
        {
            //Question 25
            question: 'Quick Time, Real one and shockwave are among the most popular web browser?',
            answers: [
                { text: 'Plugins', correct: true },
                { text: 'Cookies', correct: false },
                { text: 'Search Engine', correct: false },
                { text: 'Cascading Style sheets', correct: false }
            ]
        },
        {
            //Question 26
            question: 'Which type of web documents is run at the clients site?',
            answers: [
                { text: 'Static', correct: true },
                { text: 'Dynamic', correct: false },
                { text: 'Active', correct: false },
                { text: 'All the above', correct: false }
            ]
        },

        {
            //Question 27
            question: 'Digital photos and Scanned images are typically stored as _ Graphic with extensions such as bmp, png, jpg, tif or gif?',
            answers: [
                { text: 'Vector', correct: false },
                { text: 'Bitmap', correct: true },
                { text: 'Either vector note bitmap', correct: false },
                { text: 'Neither Vector nor bitmap', correct: false }
            ]
        },
        {
            //Question 28
            question: 'Which of the following TCP/IP protocol is used to transfer electronic mail message from one machine to another',
            answers: [
                { text: 'SMTP', correct: true },
                { text: 'FTP', correct: false },
                { text: 'POP', correct: false },
                { text: 'HTTP', correct: false }
            ]
        },
        {
            //Question 29
            question: 'Proxy server is?',
            answers: [
                { text: 'A backup servers', correct: true },
                { text: 'An email server', correct: false },
                { text: 'A poo files server', correct: false },
                { text: 'All the above', correct: false }
            ]
        },

        {
            //Question 30
            question: 'Which of the following formula is not entered correctly?',
            answers: [
                { text: '=10+50', correct: false },
                { text: '=B7*B1', correct: false },
                { text: '=B7+14', correct: false },
                { text: '10+50', correct: true }
            ]
        },
        {
            //Question 31
            question: 'A shopkeeper cheats to the extent of 10% while buying and selling by using false weight his total gains?',
            answers: [
                { text: '20%', correct: false },
                { text: '21%', correct: true },
                { text: '22%', correct: false },
                { text: '23%', correct: false }
            ]
        },
        {
            //Question 32
            question: 'By selling 45 lemons for 40Rs. a man loses 20%. How many should he sell for Rs24 to gain 20% in the transaction?',
            answers: [
                { text: '16', correct: false },
                { text: '18', correct: true },
                { text: '20', correct: false },
                { text: '22', correct: false }
            ]
        },

        {
            //Question 33
            question: 'If three numbers are in the ratio 3:2:5 and sum of their square is 1862. Then what will be the second number?',
            answers: [
                { text: '7', correct: false },
                { text: '14', correct: true },
                { text: '21', correct: false },
                { text: 'More than one above', correct: false }
            ]
        },
        {
            //Question 34
            question: 'u: v = 4:7 and v: w = 9:7 if u=72, then what is value of w?',
            answers: [
                { text: '98', correct: true },
                { text: '77', correct: false },
                { text: '63', correct: false },
                { text: '49', correct: false }
            ]
        },
        {
            //Question 35
            question: 'x: y = 6:5 and z: y 9:25, then what is the ratio of x: z?',
            answers: [
                { text: '50: 33', correct: false },
                { text: '54:125', correct: true },
                { text: '10: 3', correct: false },
                { text: '48 :25', correct: false }
            ]
        },

        {
            //Question 36
            question: 'A is to pay to B, 600 after 4 years times at 10% per annum interest rate compounding annually. A offer to pay B up to B at present. What discount present should B allow A?',
            answers: [
                { text: '31:69', correct: true },
                { text: '40:24', correct: false },
                { text: '45:14', correct: false },
                { text: '50:15', correct: false }
            ]
        },
        {
            //Question 37
            question: 'P and Q start a business with an investment of ₹28,000 and ₹42,000 respectively. P invest for 8 month and Q invest for I year. If the total profit at the end of the year is ₹21,125. Then what is the share of P?',
            answers: [
                { text: '12,625', correct: false },
                { text: '14,625', correct: false },
                { text: '6,500', correct: true },
                { text: '8,750', correct: false }
            ]
        },
        {
            //Question 38
            question: 'A mixture of 40L of milk and water contains 10% of water. How much water much be added to make the water 20% in the new mixture-?',
            answers: [
                { text: '10L', correct: false },
                { text: '7L', correct: false },
                { text: '5L', correct: true },
                { text: '3L', correct: false }
            ]
        },

        {
            //Question 39
            question: 'A 360m long train running at a uniform speed. Crosses a platform in 55 second and a man standing on the platform in 24 sec. What is the length (in meter) of platform?',
            answers: [
                { text: '465', correct: true },
                { text: '445', correct: false },
                { text: '480', correct: false },
                { text: '410', correct: false }
            ]
        },
        {
            //Question 40
            question: 'If (x + 1/x) = 8.5 then value of (x2 +1/x2) =?',
            answers: [
                { text: '70.25', correct: false },
                { text: '74.25', correct: true },
                { text: '72.25', correct: false },
                { text: '75.25', correct: false }
            ]
        },
        {
            //Question 41
            question: 'A number exceeds its two fifth by 75. The number is?',
            answers: [
                { text: '125', correct: true },
                { text: '112', correct: false },
                { text: '100', correct: false },
                { text: '150', correct: false }
            ]
        },
        {
            //Question 42
            question: 'If you know one side of a 45-45-90 triangle, then you can ALWAYS find the exact length of the 2 side?',
            answers: [

                { text: 'True', correct: true },
                { text: 'False', correct: false }

            ]
        },

        {
            //Question 43
            question: 'What is the length of Emord of a circle of radius 5cm. If the perpendicular distance center and chord is 4cm?',
            answers: [
                { text: '9cm', correct: false },
                { text: '7cm', correct: false },
                { text: '6cm', correct: true },
                { text: '8cm', correct: false }
            ]
        },
        {
            //Question 44
            question: 'A wheel makes 12 revolutions per minute. The angle in radius described by a spoken of the wheel in 1S is?',
            answers: [
                { text: '5π/2', correct: false },
                { text: '2π/5', correct: true },
                { text: '3π/5', correct: false },
                { text: '4π/5', correct: false }
            ]
        },
        {
            //Question 45
            question: 'What is the central angle of the sector corresponding to the expenditure incurred on Royality?',
            answers: [
                { text: '15°', correct: false },
                { text: '24°', correct: false },
                { text: '54°', correct: true },
                { text: '48°', correct: false }
            ]
        },

        {
            //Question 46
            question: 'The price of the book is marked 20% above the C.P. If the marked price of the book is Rs. 180, then what is the cost of the paper used in a single copy of the book?',
            answers: [
                { text: '36Rs', correct: false },
                { text: '37.50Rs', correct: true },
                { text: '37.50Rs', correct: false },
                { text: '44.25Rs', correct: false }
            ]
        },
        {
            //Question 47
            question: 'The royalty on the book is less than the printing cast by?',
            answers: [
                { text: '5%', correct: false },
                { text: '20%', correct: false },
                { text: '25%', correct: true },
                { text: '34%', correct: false }
            ]
        },
        {
            //Question 48
            question: 'After interchanging the given two numbers and sign what will be the value of equation (I) and equation (II) respectively, X and +, 3 and 9? (I) 7*9-8+2+3 </br> (II) 4*9-3+8+2',
            answers: [
                { text: '0,1', correct: false },
                { text: '-26, -29', correct: true },
                { text: '6,0', correct: false },
                { text: '12,13', correct: false }
            ]
        },

        {
            //Question 49
            question: 'In the certain language ‘BEHOLD’ is written as ‘BDEHLO’And ‘INDEED’ is writtenas ‘DDEIN’. How will ‘COURSE’ be written in language?',
            answers: [
                { text: 'CEROSU', correct: false },
                { text: 'CEORUS', correct: false },
                { text: 'CEOSUR', correct: false },
                { text: 'CEORSU', correct: true }

            ]
        },
        {
            //Question 50
            question: 'Library: Books::Museum?',
            answers: [
                { text: 'Building', correct: false },
                { text: 'Artefacts', correct: true },
                { text: 'People', correct: false },
                { text: 'Gallery', correct: false }
            ]
        },
        {
            //Question 51
            question: '382, 322, 272, 232,202?',
            answers: [
                { text: '168', correct: false },
                { text: '150', correct: false },
                { text: '182', correct: true },
                { text: '132', correct: false }
            ]
        },

        {
            //Question 52
            question: 'Select the correct combinations of mathematical sign to replace the * sign and balance the given equation </br> 21*4*156*13*11=83?',
            answers: [
                { text: '-, +, x, +', correct: false },
                { text: 'x, +, /, -', correct: false },
                { text: 'x, -, /, +', correct: true },
                { text: '+, +, -, x', correct: false }

            ]
        },
        {
            //Question 53
            question: 'PK, GT, XC, OL?',
            answers: [
                { text: 'GT', correct: false },
                { text: 'HS', correct: false },
                { text: 'EV', correct: false },
                { text: 'FU', correct: true }
            ]
        },
        {
            //Question 54
            question: 'Pik the odd one out?',
            answers: [
                { text: 'HGF', correct: false },
                { text: 'RQP', correct: false },
                { text: 'UVW', correct: true },
                { text: 'LKJ', correct: false }
            ]
        },

        {
            //Question 55
            question: '19: 324 :: 25: 576 :: 9:?',
            answers: [
                { text: '16', correct: false },
                { text: '64', correct: true },
                { text: '88', correct: false },
                { text: '72', correct: false }
            ]
        },
        {
            //Question 56
            question: 'Painting to man, a lady said, “His mother is the only daughter of my mother” How is the lady related to the man?',
            answers: [
                { text: 'Mother', correct: true },
                { text: 'Daughter', correct: false },
                { text: 'Sister', correct: false },
                { text: 'Aunt', correct: false }
            ]
        },
        {
            //Question 57
            question: 'Mohan is the son of Arum’s father sister. Prakash is the son of Reva, who is the mother of Vikash, and grandmother of Arun Pranab is father of Neela and grandfather of Mohan. Reva is wife of Pranab?',
            answers: [
                { text: 'Sister', correct: false },
                { text: 'Niece', correct: false },
                { text: 'Sister-in-law', correct: false },
                { text: 'Data in adequate', correct: true }
            ]
        },

        {
            //Question 58
            question: 'Four of the following five are alike in a certain way and hence from a group which of the following does not belong to the group?',
            answers: [
                { text: 'S', correct: false },
                { text: 'T', correct: false },
                { text: 'V', correct: false },
                { text: 'Q', correct: true }
            ]
        },
        {
            //Question 59
            question: 'QDXM: SFYN :: UIOZ:?',
            answers: [
                { text: 'PAQM', correct: false },
                { text: 'LPWA', correct: false },
                { text: 'QNLA', correct: false },
                { text: 'WKPA', correct: true }
            ]
        },
        {
            //Question 60
            question: 'SPECIAL’ is written as ‘65’ in a certain code language what will ‘CONNECT’ be coded as?',
            answers: [
                { text: '70', correct: false },
                { text: '64', correct: true },
                { text: '32', correct: false },
                { text: '78', correct: false }
            ]
        },

        {
            //Question 61
            question: 'Ram goes to towards East from point P and then turns left. She walks some distance and then turns her right. Which direction is she facing now?',
            answers: [
                { text: 'North', correct: false },
                { text: 'East', correct: true },
                { text: 'West', correct: false },
                { text: 'South', correct: false }
            ]
        },
        {
            //Question 62
            question: 'If the digits in the number ‘578462139’ are arranged in ascending order, then how many digits remain in the same place?',
            answers: [
                { text: 'Only One', correct: false },
                { text: 'Two', correct: true },
                { text: 'Three', correct: false },
                { text: 'Four', correct: false }
            ]
        },
        {
            //Question 63
            question: 'If in a certain code language ‘RAMAN’ is coded as ‘18113114’, then how will ‘KAPILA’ be coded in that language?',
            answers: [
                { text: '111196112', correct: false },
                { text: '111169112', correct: false },
                { text: '111169121', correct: true },
                { text: '116119121', correct: false }
            ]
        },

        {
            //Question 64
            question: 'If in a certain code language ‘GONE’ is written as ‘5 @ © 9’ and ‘SEAL’ is written as ‘6 9 % *’, then how will ‘LOGS’ be written in that language?',
            answers: [
                { text: '*©56', correct: false },
                { text: '*9©6', correct: false },
                { text: '*@65', correct: false },
                { text: '*@56', correct: true }
            ]
        },
        {
            //Question 65
            question: 'If ‘DOG’ is called ‘COE’, ‘COW’ is called ‘LION’, ‘LION’ is called ‘BUFFALO’, ‘BUFFALO’ is called ‘OX’, ‘OX’ is called ‘CAT’, then which of the following animals is wild one?',
            answers: [
                { text: 'DOG', correct: true },
                { text: 'BUFFALO', correct: false },
                { text: 'LION', correct: false },
                { text: 'OX', correct: false }
            ]
        },
        {
            //Question 66
            question: 'Which among the following years is a leap year?',
            answers: [
                { text: '2600', correct: false },
                { text: '2700', correct: false },
                { text: '2800', correct: true },
                { text: '3000', correct: false }
            ]
        },

        {
            //Question 67
            question: 'Select the correct spelt word?',
            answers: [
                { text: 'Concurently', correct: false },
                { text: 'Strateigy', correct: false },
                { text: 'Efficient', correct: false },
                { text: 'Prodactivity', correct: true }
            ]
        },
        {
            //Question 68
            question: 'Select the incorrect spelt word',
            answers: [
                { text: 'Rhyme', correct: true },
                { text: 'Relevant', correct: false },
                { text: 'Succesful', correct: true },
                { text: 'Queue', correct: false }
            ]
        },
        {
            //Question 69
            question: 'Which one of the following words is correctly spelt?',
            answers: [
                { text: 'Assasination', correct: true },
                { text: 'Asacination', correct: false },
                { text: 'Assatination', correct: false },
                { text: 'Assassination', correct: true }
            ]
        },

        {
            //Question 70
            question: 'Select the incorrectly spelt word?',
            answers: [
                { text: 'Texture', correct: false },
                { text: 'Slege', correct: true },
                { text: 'Savoury', correct: false },
                { text: 'Tamper', correct: false }
            ]
        },
        {
            //Question 71
            question: 'Select the most appropriate option to fill in the blank-“The Boarded window” is horror story about a man who has to ________ with his wife’sdeath.?',
            answers: [
                { text: 'Deal', correct: true },
                { text: 'Dwell', correct: false },
                { text: 'Drill', correct: false },
                { text: 'Deed', correct: false }
            ]
        },
        {
            //Question 72
            question: 'What is the most appropriate synonym to the given word--Sheer?',
            answers: [
                { text: 'Entire unalloyed and unadulterated', correct: false },
                { text: 'Barely perceptible and evanescent.', correct: true },
                { text: 'Mildly significant and inconsequential.', correct: false },
                { text: 'Partially translucent and diaphanous', correct: false },
                { text: 'Slightly veiled and obscured.', correct: false }
            ]
        },

        {
            //Question 73
            question: 'What is the most appropriate synonym of the given word--Grim?',
            answers: [
                { text: 'Mild', correct: false },
                { text: 'Atrocious', correct: true },
                { text: 'Benign', correct: false },
                { text: 'Cozy', correct: false }
            ]
        },
        {
            //Question 74
            question: 'Select the INCORRECTLY spelt word?',
            answers: [
                { text: 'Interrogation', correct: false },
                { text: 'Magistrate', correct: false },
                { text: 'Preliminary', correct: false },
                { text: 'Diciplinary', correct: true }
            ]
        },
        {
            //Question 75
            question: 'Select the option that can be used as a one-word substitute for the given grou[ of words?',
            answers: [
                { text: 'Amble', correct: true },
                { text: 'Sprint', correct: false },
                { text: 'Crawl', correct: false },
                { text: 'Slither', correct: false }
            ]
        },

        {
            //Question 76
            question: 'Select the most appropriate ANTONYM of the given word?',
            answers: [
                { text: 'Unhappy', correct: true },
                { text: 'Conceited', correct: false },
                { text: 'Sillen', correct: false },
                { text: 'Glum', correct: false }
            ]
        },
        {
            //Question 77
            question: 'Select the INCORRECTLY spelt word.?',
            answers: [
                { text: 'Finery', correct: true },
                { text: 'Hiest', correct: false },
                { text: 'Cringe', correct: false },
                { text: 'Defer', correct: false }
            ]
        },
        {
            //Question 78
            question: 'Which of the following is a synonym for "happy"?',
            answers: [
                { text: 'Sad', correct: false },
                { text: 'Angry', correct: false },
                { text: 'Joyful', correct: true },
                { text: 'Bored', correct: false }
            ]
        },

        {
            //Question 79
            question: 'Choose the correct sentence?',
            answers: [
                { text: ' She are going to the store', correct: false },
                { text: 'She is going to the store', correct: true },
                { text: 'She am going to the store', correct: false },
                { text: 'She am going to the store', correct: false }
            ]
        },
        {
            //Question 80
            question: 'What is the past tense of "go"?',
            answers: [
                { text: 'Going', correct: false },
                { text: 'Goes', correct: false },
                { text: 'Went', correct: true },
                { text: 'Gone', correct: false }
            ]
        },
        {
            //Question 81
            question: 'What is the plural form of "child"?',
            answers: [
                { text: 'Childs', correct: false },
                { text: 'Childes', correct: false },
                { text: 'Children', correct: true },
                { text: 'Childrens', correct: false }
            ]
        },

        {
            //Question 82
            question: 'Which of the following is a noun??',
            answers: [
                { text: 'Run', correct: false },
                { text: 'Quickly', correct: false },
                { text: 'Happiness', correct: true },
                { text: 'Beautiful', correct: false }
            ]
        },
        {
            //Question 83
            question: 'Which word is a verb?',
            answers: [
                { text: 'Apple', correct: false },
                { text: 'Jump', correct: true },
                { text: 'Green', correct: false },
                { text: 'Slowly', correct: false }
            ]
        },
        {
            //Question 84
            question: 'What is the opposite of "cold"?',
            answers: [
                { text: 'Cool', correct: false },
                { text: 'Hot', correct: true },
                { text: 'Warm', correct: false },
                { text: 'Freezing', correct: false }
            ]
        },

        {
            //Question 85
            question: 'Choose the correct article: "I saw ___ dog in the park.?',
            answers: [
                { text: ' a', correct: true },
                { text: 'an', correct: false },
                { text: 'the', correct: false },
                { text: ' none', correct: false }
            ]
        },
        {
            //Question 86
            question: 'Which sentence is correc?',
            answers: [
                { text: 'He run fast', correct: false },
                { text: ' He runs fas', correct: true },
                { text: 'He running fas', correct: false },
                { text: 'He runned fast.', correct: false }
            ]
        },
        {
            //Question 87
            question: 'What is the past tense of "eat"?',
            answers: [
                { text: 'Ate', correct: true },
                { text: 'Eated', correct: false },
                { text: 'Eats', correct: false },
                { text: 'Eating', correct: false }
            ]
        },

        {
            //Question 88
            question: 'Which of the following is an adjectiv?',
            answers: [
                { text: 'Sing', correct: false },
                { text: 'Walks', correct: false },
                { text: 'Yellow', correct: true },
                { text: 'Walked', correct: false }
            ]
        },
        {
            //Question 89
            question: 'What is the correct form of the verb in the sentence: "She ___ every day."?',
            answers: [
                { text: 'Walks ', correct: true },
                { text: 'Relevant', correct: false },
                { text: 'Succesful', correct: true },
                { text: 'Queue', correct: false }
            ]
        },
        {
            //Question 90
            question: 'Which word is an adverb?',
            answers: [
                { text: 'Dog', correct: false },
                { text: 'Slowly', correct: true },
                { text: 'Car', correct: false },
                { text: 'Red', correct: false }
            ]
        },

        {
            //Question 91
            question: 'Choose the correct sentence?',
            answers: [
                { text: 'They is happy', correct: false },
                { text: 'They are happy', correct: true },
                { text: 'They am happy.', correct: false },
                { text: ' They be happy.', correct: false }
            ]
        },
        {
            //Question 92
            question: 'What is the opposite of "good"?',
            answers: [
                { text: 'Bad', correct: true },
                { text: 'Better', correct: false },
                { text: 'Well', correct: false },
                { text: 'Best', correct: false }
            ]
        },
        {
            //Question 93
            question: 'Which of the following is a pronoun?',
            answers: [
                { text: 'Cat', correct: false },
                { text: 'Him', correct: true },
                { text: 'Run', correct: false },
                { text: ' Table', correct: false }
            ]
        },

        {
            //Question 94
            question: 'Which word is a preposition?',
            answers: [
                { text: 'Under', correct: true },
                { text: 'Fast', correct: false },
                { text: 'Yellow', correct: false },
                { text: 'Sing', correct: false }
            ]
        },
        {
            //Question 95
            question: 'What is the past tense of "write"?',
            answers: [
                { text: ' Writed', correct: false },
                { text: 'Wrote', correct: true },
                { text: 'Writing', correct: false },
                { text: 'Writes', correct: false }
            ]
        },
        {
            //Question 96
            question: 'Choose the correct form of the verb: "They ___ a book.?',
            answers: [
                { text: 'Reads', correct: false },
                { text: ' Read', correct: true },
                { text: 'Reading', correct: false },
                { text: 'Readed', correct: false }
            ]
        },

        {
            //Question 97
            question: 'Which sentence is correct?',
            answers: [
                { text: 'I has a cat', correct: false },
                { text: ' I have a cat', correct: true },
                { text: 'I haves a cat', correct: false },
                { text: 'I having a cat', correct: false }
            ]
        },
        {
            //Question 98
            question: 'What is the plural form of "mouse"?',
            answers: [
                { text: 'Mouses', correct: false },
                { text: 'Mouse', correct: false },
                { text: 'Mices', correct: false },
                { text: 'Mice', correct: true }
            ]
        },
        {
            //Question 99
            question: 'Which word is a conjunction"?',
            answers: [
                { text: 'And', correct: true },
                { text: 'Dog', correct: false },
                { text: 'Quickly', correct: false },
                { text: 'Blue', correct: false }
            ]
        },

        {
            //Question 100
            question: 'Choose the correct sentence?',
            answers: [
                { text: ' She were at the party', correct: false },
                { text: 'She was at the party', correct: true },
                { text: 'She is at the part', correct: false },
                { text: 'She be at the party.', correct: false }
            ]
        }
    ];
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
                quizEndTime: endTime
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
       try{
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
       }catch(e){
        toast.error("Some Error Occurs Please Refresh the page")
       }


    };

    const handleNextQuestion = () => {
        setSelectedAnswersList(prevAnswers => [...prevAnswers, selectedAnswer]);
        if (selectedAnswer.correct) {
            setScore(score + 1);

        } else if (selectedAnswer.correct === false) {
            setScore(score - 0.25);
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
                                    <span className="font-bold text-gray-500">Test Start Time:</span>
                                    <span className="ml-3 text-lg text-gray-900">{responseData.quizStartTime}</span>
                                </div>
                                <div className="mb-6">
                                    <span className="font-bold text-gray-500">Test End Time:</span>
                                    <span className="ml-3 text-lg text-gray-900">{responseData.quizEndTime}</span>
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
                            <button
                                className={`text-lg px-8 py-3 rounded-lg font-sans focus:outline-none focus:ring-4 focus:ring-indigo-300 ${isAgreed
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                onClick={handleStart}
                                disabled={!isAgreed}
                            >
                                Start the Quiz
                            </button>
                        </div>
                    </div>
                
            </dialog>
            
        </div>
    );
};

export default Quiz;
