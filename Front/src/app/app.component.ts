import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { HubConnectionService } from './hub-connection.service';
import { RoomGrouphubInput } from './iRoomGroupHubInput';
import { userData } from './iuserData';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public temp = Array(1).fill(15).map((x, i) => i + 1);
  private roomGroupHubInput: RoomGrouphubInput = { connectionId: "", chatId: NaN, name: "" }

  constructor(private _authService: AuthService, private _chatService: ChatService, private _hubConnectionService: HubConnectionService, private _router: Router) { }

  ngOnInit(): void {
  }

  async logout() {
    let isLogout = await this._authService.signOut();
    if (isLogout) {
      this.logoutCleanup();
      this._router.navigate(['']);
    }
    else alert("Logout Failed ! Server Error!");
  }

  logoutCleanup() {
    let roomGroupHubInput: RoomGrouphubInput = { connectionId: this._hubConnectionService.connectionId, chatId: this._chatService.currentChatData.chatId, name: this._chatService.currentChatData.name };
    if (this._chatService._isJoinedAGroup) this._chatService.leavePrevRoomHub(roomGroupHubInput);

    setTimeout(() => {
      this._authService.resetAuthService();
      this._chatService.resetChatSevice();
      window.location.reload();
    }, 1);
  }

  isAuthenticated() {
    return this._authService.isAuthenticated();
  }

  getCurrentUser() {
    return { ...this._authService.userData };
  }

  // toggle private chat
  togglePrivateModal(privateRoomModal: HTMLDivElement) {
    privateRoomModal.classList.toggle("active");
  }

  findMembers() {
    return [...this._chatService.privateMemebersData];
  }

  async showPrivateMembers(privateRoomModal: HTMLDivElement) {
    await this._chatService.fetchUsers();
    this.togglePrivateModal(privateRoomModal);
  }

  async joinPrivateChat(user: userData, privateRoomModal: HTMLDivElement) {
    await this._chatService.joinPrivateChat(user);
    let prevRoomGroupHubInput = { ...this._chatService.roomGroupHubInput };
    this.roomGroupHubInput.connectionId = this._hubConnectionService.connectionId;
    this.roomGroupHubInput.chatId = this._chatService.currentChatData.chatId;
    this.roomGroupHubInput.name = this._chatService.currentChatData.name;
    let _isJoinedAGroup = await this._chatService.joinNewRoomHub(prevRoomGroupHubInput, this.roomGroupHubInput);
    if (!_isJoinedAGroup) this._chatService._isJoinedAGroup = false;
    this._hubConnectionService.chatBodyScroll();
    this.togglePrivateModal(privateRoomModal);
  }

  title = 'Chat Application';
}
