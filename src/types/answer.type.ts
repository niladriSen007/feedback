import { Document } from "mongoose";
import { User } from "./user.type";
import { Question } from "./question.type";

export interface Answer extends Document{
     answer: string;
    aAuthor: User;
     question: Question;
     createdAt: Date;
     updatedAt: Date;
}