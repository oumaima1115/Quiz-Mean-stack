export interface QuizTest {
    id:              string;
    nbrEssay:        number;
    score:           number;
    correctAnswer:   number;
    incorrectAnswer: number;
    UnAnswered:      number;
    passingGrade:    string;
    timeTaken:       number;
    quizId:          string;
    userId:          string;
}