import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { MsgData } from '../imsgData';
import { AuthService } from '../auth.service';
import { userData } from '../iuserData';
import { ChatService } from '../chat.service';
import { RoomData } from '../iRoomData';
import { RoomGrouphubInput } from '../iRoomGroupHubInput';
import { HubConnectionService } from '../hub-connection.service';

@Component({
  selector: 'app-chat-home',
  templateUrl: './chat-home.component.html',
  styleUrls: ['./chat-home.component.css']
})
export class ChatHomeComponent implements OnInit, OnDestroy {
  public userData: userData = { id: "", firstName: '', lastName: '', email: '', password: '' };
  public sendMessage: MsgData = { id: NaN, name: '', userId: "", text: '', date: '', time: '' };
  private roomGroupHubInput: RoomGrouphubInput = { connectionId: "", chatId: NaN, name: "" }
  public connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5000/message")
    // .withAutomaticReconnect([0, 2000, 1000, 3000])
    .build();

  constructor(private _authService: AuthService, private _chatService: ChatService, private _router: Router, private _hubConnectionService: HubConnectionService) { }

  ngOnInit(): void {
    if (this._authService.isAuthenticated()) {
      // Set User Credentials
      this.userData = this._authService.getUserData();
      this._chatService.setUser();
      this.sendMessage.name = this.userData.firstName;
      this.sendMessage.userId = this.userData.id;
      this._chatService.fetchJoinedRooms();
      this._chatService.fetchStoreRooms();
      this._chatService.fetchUsers();

      this.connection = this._hubConnectionService.startConnection(this.connection);
      this._hubConnectionService.setConnectionOperation(this.connection);

    }
    else this._router.navigate(['']);
  }

  async ngOnDestroy(): Promise<void> {
    await this.connection.stop();
    this._hubConnectionService.terminateConnection(this.connection);
    console.log("Connection terminated");
    let isLogout = await this._authService.signOut();
    if (isLogout) {
      setTimeout(() => {
        this._authService.resetAuthService();
        this._chatService.resetChatSevice();
        window.location.reload();
      }, 1);
    }
  }

  isThisUsr(msgd: MsgData) {
    console.log(msgd);
    return msgd.userId == this.userData.id;
  }

  // Toggle room modal
  toggleModal(inpt: HTMLInputElement, createRoomModal: HTMLDivElement) {
    createRoomModal.classList.toggle("active");
    inpt.value = "";
    inpt.focus();
  }

  // Create Room chat
  async createChat(inpt: HTMLInputElement, createRoomModal: HTMLDivElement) {
    if (inpt.value != "") {
      await this._chatService.createRoom(inpt.value);
      this.toggleModal(inpt, createRoomModal);
    }
    else alert("Room name can't be empty!");
  }
  //Join other rooms
  async joinChatRoom(room: RoomData, inpt: HTMLInputElement, createRoomModal: HTMLDivElement) {
    let isJoined = await this._chatService.joinRoom(room);
    if (isJoined) {
      await this._chatService.fetchJoinedRooms();
      await this._chatService.fetchStoreRooms();
      this.toggleModal(inpt, createRoomModal);
    }
    else alert("Room name can't be empty!");
  }

  isJoinedGroup() {
    return this._chatService._isJoinedAGroup && this._hubConnectionService.isConnected;
  }

  // Check if the chat room is start or not
  sendMsg(msgInp: HTMLTextAreaElement) {
    if (this._chatService._isJoinedAGroup) {
      if (msgInp.value != "") {
        let jdt = new Date().toDateString().split(" ").slice(1);
        this.sendMessage.date = jdt[0] + " " + jdt[1] + ", " + jdt[2];
        this.sendMessage.time = new Date().toLocaleTimeString();
        this.sendMessage.id = 0;
        this._chatService.sendMessageToGroup(this.sendMessage);
        this.sendMessage.text = "";
        msgInp.focus();
      }
    }
    else alert("You are not joined to any room!");
  }
  // ChatBody Scroll
  chatBodyScroll() {
    setTimeout(() => {
      let chatBody = document.getElementById('chatBody');
      if (chatBody != undefined && chatBody != null)
        chatBody.scrollTo(0, chatBody.scrollHeight);
    }, 0);
  }
  isNotMsgEmpty() {
    if (this._chatService.currentChatData.messages.length != 0) return true;
    else return false;
  }
  getMessage() {
    return [...this._chatService.currentChatData.messages];
  }
  // ChatHead Control
  getChatHead() {
    return [...this._chatService.chatRoomData];
  }
  getStoreRoom() {
    return [...this._chatService.chatStoreRoomData]
  }
  getCurrentChatHead() {
    return this._chatService.currentChatData;
  }
  async fetchRoomData(room: RoomData) {
    if (room.chatId != this._chatService.currentChatData.chatId) {
      let prevRoomGroupHubInput = { ...this.roomGroupHubInput };
      this.roomGroupHubInput.connectionId = this._hubConnectionService.connectionId;
      this.roomGroupHubInput.chatId = room.chatId;
      this.roomGroupHubInput.name = room.name;
      let _isJoinedAGroup = await this._chatService.joinNewRoomHub(prevRoomGroupHubInput, this.roomGroupHubInput);
      if (_isJoinedAGroup) await this._chatService.fetchRoomData(room);
      this.chatBodyScroll();
    }
  }

}
