import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { MsgData } from './imsgData';
import { userData } from './iuserData';
import { HttpClient } from '@angular/common/http';
import { RoomData } from './iRoomData';
import { RoomCreateInput } from './iRoomCreatInput';
import { RoomGrouphubInput } from './iRoomGroupHubInput';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public userData: userData = { id: "", firstName: '', lastName: '', email: '', password: '' };
  public currentChatData: RoomData = { chatId: NaN, messages: [], name: '', type: 1, users: [] };
  public chatRoomData: RoomData[] = [];
  public chatStoreRoomData: RoomData[] = [];

  public privateMemebersData: userData[] = [];

  public roomCreateInput: RoomCreateInput = { chatId: 0, name: "", type: 1, user: { ...this.userData } };
  public roomGroupHubInput: RoomGrouphubInput = { connectionId: "", chatId: NaN, name: "" };
  public _isJoinedAGroup: boolean = false;

  constructor(private _authService: AuthService, private _http: HttpClient) {
    this.setUser();
  }

  setUser() {
    this.userData = { ...this._authService.userData };
    this.roomCreateInput.user = { ...this.userData }
  }

  setroomGroupHubInput(roomGroupHubInput: RoomGrouphubInput) {
    this.roomGroupHubInput = { ...roomGroupHubInput };
  }
  getCurrentRoomData() {
    return this.chatRoomData;
  }
  pushMsg(newMessage: MsgData) {
    this.currentChatData.messages.push(newMessage);
  }
  deleteFilterMsg(msgId: number) {
    this.currentChatData.messages = this.currentChatData.messages.filter((msg) => {
      return msg.id != msgId;
    });
  }

  resetChatSevice() {
    this.userData = { id: "", firstName: '', lastName: '', email: '', password: '' };
    this.currentChatData = { chatId: NaN, messages: [], name: '', type: 1, users: [] };
    this.chatRoomData = [];
    this.chatStoreRoomData = [];
    this.privateMemebersData = [];
    this.roomCreateInput = { chatId: 0, name: "", type: 1, user: { ...this.userData } };
    this.roomGroupHubInput = { connectionId: "", chatId: NaN, name: "" };
    this._isJoinedAGroup = false;
  }

  async createRoom(roomName: string) {
    let url = 'http://localhost:5000/api/room/createroom';
    this.roomCreateInput.name = roomName;
    await this._http.post(url, this.roomCreateInput).toPromise()
      .then((data) => {
        console.log(data);
      });
  }
  async joinRoom(room: RoomData) {
    let url = 'http://localhost:5000/api/room/joinroom';
    this.roomCreateInput.chatId = room.chatId;
    this.roomCreateInput.name = room.name;
    this.roomCreateInput.type = room.type;
    let isJoined = false;
    await this._http.post(url, this.roomCreateInput).toPromise()
      .then((data) => {
        console.log(data);
        isJoined = true;
      });
    return isJoined;
  }

  async leavePrevRoomHub(prevRoomGrouphubInput: RoomGrouphubInput) {
    let urljoin = 'http://localhost:5000/api/chat/leaveroomhub';
    let isLeaveRoomHub = false;
    await this._http.post(urljoin, prevRoomGrouphubInput).toPromise()
      .then((data) => {
        console.log(data);
        isLeaveRoomHub = true;
        this._isJoinedAGroup = false;
      })
      .catch(err => alert("Leaving previous room failed!"));
    return isLeaveRoomHub;
  }
  async joinNewRoomHub(prevRoomGrouphubInput: RoomGrouphubInput, newRoomGrouphubInput: RoomGrouphubInput) {
    let urljoin = 'http://localhost:5000/api/chat/joinroomhub';
    let isJoinedRoomHub = false;
    let isLeaveRoomHub = true;

    if (!Number.isNaN(prevRoomGrouphubInput.chatId)) isLeaveRoomHub = await this.leavePrevRoomHub(prevRoomGrouphubInput);
    if (isLeaveRoomHub) {
      await this._http.post(urljoin, newRoomGrouphubInput).toPromise()
        .then((data) => {
          this.roomGroupHubInput = { ...newRoomGrouphubInput };
          isJoinedRoomHub = true;
          this._isJoinedAGroup = true;
        })
        .catch(err => alert("Joining room failed!"));
    }
    return isJoinedRoomHub;
  }

  async fetchJoinedRooms() {
    let url = 'http://localhost:5000/api/room/getjoinedrooms';
    await this._http.post<RoomData[]>(url, this.userData).toPromise()
      .then((data) => this.chatRoomData = [...data])
      .catch(err => alert("There's been an err in fetching data!"));
  }
  async fetchStoreRooms() {
    let url = 'http://localhost:5000/api/room/getstorerooms';
    await this._http.post<RoomData[]>(url, this.userData).toPromise()
      .then((data) => this.chatStoreRoomData = [...data]);
  }
  async fetchRoomData(room: RoomData) {
    let url = 'http://localhost:5000/api/room/getchatdata';
    await this._http.post<RoomData>(url, room).toPromise()
      .then((data) => {
        this.currentChatData = { ...data };
      });
  }

  // Fetch Users
  async fetchUsers() {
    let url = 'http://localhost:5000/api/room/getotherusers';
    await this._http.post<userData[]>(url, this.userData).toPromise()
      .then((data) => this.privateMemebersData = [...data]);
  }

  async joinPrivateChat(user: userData) {
    let url = 'http://localhost:5000/api/room/startprivateroom';
    await this._http.post<RoomData>(url, [this.userData, user]).toPromise()
      .then((data) => {
        if (this.currentChatData.chatId != data.chatId) this.currentChatData = { ...data };
      });
  }

  // Sending message
  async sendMessageToGroup(msg: MsgData) {
    let url = 'http://localhost:5000/api/chat/sendmsgtogrpdb';
    await this._http.post(url, { "chat": this.currentChatData, "message": msg }).toPromise()
      .then((data) => console.log(data));
  }

  async sendMsgToDb(msg: MsgData) {
    let url = 'http://localhost:5000/api/room/sendmsgdb';
    await this._http.post(url, { "chat": this.currentChatData, "message": msg }).toPromise()
      .then((data) => console.log(data));
  }

  // Deleting message
  async deleteMsg(msg: MsgData) {
    let url = 'http://localhost:5000/api/chat/deletemsg';
    await this._http.post(url, { "chat": this.currentChatData, "message": msg }).toPromise()
      .then((data) => console.log(data));
  }
}
