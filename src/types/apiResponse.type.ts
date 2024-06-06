import { Answer } from "./answer.type";

export interface ApiResponse {
  success: boolean;
  message: string;
  status: number;
  answers?: Array<Answer>;
}