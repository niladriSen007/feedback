import { Document } from "mongoose";
import { Question } from "./question.type";
import { Answer } from "./answer.type";
export interface User extends Document{
    name: string;
    email: string;
    isVerified: boolean;
    verificationTCode: string;
    verificationExpiry: Date;
    password: string;
    questionsRaised : Question[];
    answersGiven : Answer[];
    createdAt: Date;
    updatedAt: Date;
}