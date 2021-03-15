import { userData } from "./iuserData";

export interface RoomCreateInput {
    chatId: number;
    name: string;
    type: number;
    user: userData;
}