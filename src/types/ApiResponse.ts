import { Message } from "@/model/User";

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    isAcceptingMessages?: boolean;
    messages?: Message[];
}