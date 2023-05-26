import {Choice} from "./choice.model";

export interface Answer{
    title:    string;
    feedback: string;
    option:   Array<Choice>;
}