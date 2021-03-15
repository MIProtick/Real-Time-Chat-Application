import { MsgData } from "./imsgData";

export interface RoomData {
    chatId: number;
    messages: MsgData[];
    name: string;
    type: number;
    users: Object;
}