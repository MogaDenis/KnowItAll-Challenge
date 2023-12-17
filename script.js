const questions = [];
const answers = [];
const correctAnswers = [];

async function readTextFile(file) {

    return fetch(file)
        .then((res) => res.text())
        .then((text) => {
            return text;
        })
        .catch((e) => console.error(e));
}

async function populateQuestionsAndAswers() {
    let text = await readTextFile("./questions.json");

    if (text == null)
        return;

    const questionsList = JSON.parse(text)["questions"];

    for (let index = 0; index < questionsList.length; index++) {
        questions.push(questionsList[index]["question"]);
        answers.push(questionsList[index]["answers"]);
        correctAnswers.push(questionsList[index]["correctAnswer"]);
    }
}


let quiz, questionText, answerLabels, checkboxes, score, scoreMessage;
let modal, overlay;
let questionsPool;
let currentQuestion;

function setupQuiz() {
    modal = document.querySelector(".modal");
    overlay = document.querySelector(".overlay");

    // Hide the modal with the score.
    modal.classList.add("hidden");
    overlay.classList.add("hidden");

    quiz = new Quiz(questionsPool, 10);

    questionText = document.getElementById("question-text");
    scoreMessage = document.getElementById("score-message");

    answerLabels = [];
    checkboxes = [];
    for (let index = 1; index <= 4; index++) { // 4 answers and 4 checkboxes.
        answerLabels.push(document.getElementById("answer" + index));
        checkboxes.push(document.getElementById("checkbox" + index));
    }

    score = 0;
}

function showNextQuestion() {
    const nextQuestion = quiz.getNext();

    if (nextQuestion == null)
        return null;

    questionText.innerText = quiz.currentQuestionIndex + ". " + nextQuestion.getQuestion();

    const questionAnswers = nextQuestion.getAnswers();

    for (let index = 0; index < answerLabels.length; index++) {
        answerLabels[index].innerText = questionAnswers[index];
        checkboxes[index].checked = false;
    }

    return nextQuestion;
}

// When a checkbox is clicked, this clears the other checkboxes. (only one answer can be selected)
function clearOtherCheckboxes(checkboxIndexToSkip) {
    for (let index = 0; index < checkboxes.length; index++) {
        if (index != checkboxIndexToSkip - 1)
            checkboxes[index].checked = false;
    }
}

function evaluateAnswer(currentQuestion) {
    if (currentQuestion == null)
        return;

    for (let index = 0; index < checkboxes.length; index++) {
        if (checkboxes[index].checked && currentQuestion.isAnswerCorrect(currentQuestion.getAnswers()[index])) {
            score++;
            break;
        }
    }
}

// Async function, must be used with 'await', pauses the execution for a given time in miliseconds.
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function displayScore() {
    scoreMessage.innerText = "Final score: " + score + "/" + quiz.numberOfQuestions;

    await sleep(100);

    // Show the modal with the score.
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    await sleep(2500);
}

function checkIfUserSelectedAnAnswer() {
    for (let index = 0; index < 4; index++)
        if (checkboxes[index].checked)
            return true;

    return false;
}

// This function is called everytime the user submits an answer.
async function submitAnswer() {
    if (!checkIfUserSelectedAnAnswer())
    {
        window.alert("Please choose an answer!");
        return;
    }

    evaluateAnswer(currentQuestion);
    currentQuestion = showNextQuestion();

    if (currentQuestion == null) { // Quiz Over. 
        await displayScore();

        newQuiz(); // Start a new Quiz.
    }
}

function newQuiz() {
    setupQuiz();
    currentQuestion = showNextQuestion();
}

function main() {
    questionsPool = new QuestionsPool(questions, answers, correctAnswers);
    newQuiz();
}

// Read the data from the .json file, then start the quiz.
populateQuestionsAndAswers().then(() => main());
