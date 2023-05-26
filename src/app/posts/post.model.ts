import {Option} from "./option.model";
export interface Post {
    id:              string;
    title:           string;
    feedback:        string;
    type:            string;
    answer:          Array<Option>;
    imagePath:       string;
    correctChoices:  number;
    numberOfChoices: number;
    quiz:            string;
    creator:         string;
  }