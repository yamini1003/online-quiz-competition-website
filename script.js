// Registration logic
document.getElementById('registrationForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Check for existing user
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = existingUsers.find(user => user.email === email);
    
    if (existingUser) {
        document.getElementById('registrationError').innerText = 'Email already registered.';
        return;
    }

    // Save user data
    existingUsers.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(existingUsers)); // Store users in localStorage
    alert('Registration successful! You can now log in.');
    window.location.href = 'login.html'; // Redirect to login page
});

// Login logic
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const loginEmail = document.getElementById('loginEmail').value;
    const loginPassword = document.getElementById('loginPassword').value;

    // Validate login
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === loginEmail && user.password === loginPassword);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.name);
        window.location.href = 'quiz.html'; // Redirect to quiz page
    } else {
        document.getElementById('loginMessage').innerText = 'Invalid email or password.';
    }
});

// Profile page logic
document.addEventListener('DOMContentLoaded', () => {
    if (document.title === "Profile") {
        const name = localStorage.getItem('userName');
        if (name) {
            document.getElementById('profileUsername').innerText = `Username: ${name}`;
            document.getElementById('quizzesTaken').innerText = `Quizzes Taken: ${localStorage.getItem('quizzesTaken') || 0}`;
        } else {
            alert('Please log in to view your profile.');
            window.location.href = 'login.html'; // Redirect to login page if not logged in
        }
    }
});

// Quiz page access check
if (document.title === "Quiz") {
    if (!localStorage.getItem('isLoggedIn')) {
        alert('Please log in to access the quiz.');
        window.location.href = 'login.html'; // Redirect to login page if not logged in
    }
}

// Quiz logic
const quizzes = {
    html: [
        {
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "None of these"],
            answer: "Hyper Text Markup Language"
        },
        {
            question: "Who is making the Web standards?",
            options: ["Mozilla", "Google", "The World Wide Web Consortium", "Microsoft"],
            answer: "The World Wide Web Consortium"
        }
    ],
    css: [
        {
            question: "What does CSS stand for?",
            options: ["Colorful Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets"],
            answer: "Cascading Style Sheets"
        },
        {
            question: "Where in an HTML document can you put CSS?",
            options: ["In the <head> section", "In the <body> section", "Both the <head> section and the <body> section", "In the <footer> section"],
            answer: "Both the <head> section and the <body> section"
        }
    ],
    javascript: [
        {
            question: "What is the correct syntax for referring to an external script called 'script.js'?",
            options: ["<script src='script.js'>", "<script href='script.js'>", "<script ref='script.js'>", "<script name='script.js'>"],
            answer: "<script src='script.js'>"
        },
        {
            question: "How do you declare a JavaScript variable?",
            options: ["var carName;", "variable carName;", "v carName;", "declare carName;"],
            answer: "var carName;"
        }
    ],
    sql: [
        {
            question: "Which SQL statement is used to extract data from a database?",
            options: ["GET", "SELECT", "EXTRACT", "PULL"],
            answer: "SELECT"
        },
        {
            question: "Which SQL statement is used to update data in a database?",
            options: ["MODIFY", "UPDATE", "SET", "CHANGE"],
            answer: "UPDATE"
        }
    ]
};

// Start Quiz function
function showQuiz(category) {
    localStorage.setItem('selectedQuiz', category); // Store selected quiz category
    const quizContainer = document.getElementById('quiz');
    const quizQuestionsDiv = document.getElementById('quizQuestions');
    
    quizQuestionsDiv.innerHTML = ''; // Clear previous questions

    // Display selected quiz questions
    quizzes[category].forEach((q, index) => {
        quizQuestionsDiv.innerHTML += `
            <h3>Question ${index + 1}: ${q.question}</h3>
            ${q.options.map(option => `
                <input type="radio" name="question${index}" value="${option}" required> ${option}<br>
            `).join('')}
        `;
    });

    // Ensure the quiz form is shown after clicking the button
    document.getElementById('quiz').style.display = 'block'; // Show quiz container
}

// Handle quiz form submission
document.getElementById('quizForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const results = [];
    let score = 0;

    // Check answers
    const category = localStorage.getItem('selectedQuiz');
    quizzes[category].forEach((quiz, index) => {
        const userAnswer = document.querySelector(`input[name="question${index}"]:checked`);
        if (userAnswer) {
            results.push(`Question ${index + 1}: ${userAnswer.value}`);
            if (userAnswer.value === quiz.answer) {
                score++;
            }
        }
    });

    // Display results
    document.getElementById('quiz-result').innerHTML = `
        <h3>Your Results</h3>
        <p>Score: ${score} out of ${quizzes[category].length}</p>
        <p>Answers: ${results.join(', ')}</p>
    `;

    // Track quizzes taken
    let quizzesTaken = parseInt(localStorage.getItem('quizzesTaken') || 0, 10);
    localStorage.setItem('quizzesTaken', ++quizzesTaken);
});
