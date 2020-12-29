export type Difficulty = 'Very Easy' | 'Easy' | 'Medium' | 'Hard'; 

export interface Question {
    Volunteer: string;
    Difficulty?: Difficulty;
    Categories?: string[];
    Question: string;
    Answer: string;
}

export interface TriviaOptions {
    Difficulty?: Difficulty;
    Categories?: string[];
    NumberofQuestions?: number;
}