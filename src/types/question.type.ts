import { Document } from "mongoose";

import { Answer } from "./answer.type";
import { User } from "./user.type";
export interface Question extends Document{
    question: string;
    qAuthor: User;
    isacceptingans: boolean;
    isclosed: boolean;
    answers: Answer[];
    createdAt: Date;
    updatedAt: Date;
}