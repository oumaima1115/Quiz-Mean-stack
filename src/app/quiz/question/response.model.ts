import {Answer} from "./answer.model";

export interface Response {
    id:        string;
    userId:    string;
    quizId:    string;
    timeTaken: number;
    nbrEssay:  number
    answer:    Array<Answer>;
}