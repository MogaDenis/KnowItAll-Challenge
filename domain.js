class Question {
    constructor(ID, question, answers, correctAnswer) {
        this.ID = ID;
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }

    getQuestion() {
        return this.question;
    }

    getAnswers() {
        return this.answers;
    }

    getID() {
        return this.ID;
    }

    isAnswerCorrect(answer) {
        return answer === this.correctAnswer;
    }
}

// Randomly shuffles the given array.
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Class responsible for holding all questions and returning a given number of random ones.
class QuestionsPool {
    constructor(questions, answers, correctAnswers) {
        this.allQuestions = [];
        this.randomQuestionIndices = [];

        for (let index = 0; index < questions.length; index++) {
            this.allQuestions.push(new Question(index + 1, questions[index], answers[index], correctAnswers[index]));
            this.randomQuestionIndices.push(index);
        }

        this.usedQuestions = 0;
    }

    getRandomQuestions(numberOfQuestions) {
        this.randomQuestionIndices = shuffle(this.randomQuestionIndices);

        // If a number of questions greater than the number of available ones is required, return all the questions available.
        if (numberOfQuestions > this.allQuestions.length)
            numberOfQuestions = this.allQuestions.length;

        const randomQuestions = [];
        for (let index = 0; index < numberOfQuestions; index++)
            randomQuestions.push(this.allQuestions[this.randomQuestionIndices[index]]);

        return randomQuestions;
    }
}

// Holds the random questions and is responsible for providing the next question at each step.
class Quiz {
    constructor(questionsPool, numberOfQuestions) {
        this.questions = questionsPool.getRandomQuestions(numberOfQuestions);

        this.currentQuestionIndex = 0;
        this.numberOfQuestions = numberOfQuestions;

        this.score = 0;
    }

    getNext() {
        if (this.currentQuestionIndex >= this.questions.length)
            return null;

        return this.questions[this.currentQuestionIndex++];
    }

    getScore() {
        return this.score;
    }

    setScore(newScore) {
        this.score = newScore;
    } 
}