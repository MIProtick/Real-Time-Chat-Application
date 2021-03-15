import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class HubConnectionService {

  public connectionId: string = ""
  public isConnected: boolean = false;

  constructor(private _chatService: ChatService) { }

  startConnection(connection: HubConnection) {
    connection.start()
      .then(() => {
        console.log("Connection Started!");
        this.isConnected = true;
        connection.invoke("GetConnectionId")
          .then((connectionId) => this.connectionId = connectionId)
          .catch((err) => console.log(err))
      })
      .catch(err => console.log(err));
    return connection;
  }

  terminateConnection(connection: HubConnection) {
    connection.stop();
    this.isConnected = false;
    this.connectionId = "";
  }

  getConnectionId() {
    return this.connectionId;
  }

  setConnectionOperation(connection: HubConnection) {
    connection.on("roomCreated", (chatRoomsData) => {
      this._chatService.fetchJoinedRooms();
      this._chatService.fetchStoreRooms();
    });
    connection.on("receiveMsg", (id, user, userid, msg, date, time, chatId) => {
      if (chatId == this._chatService.currentChatData.chatId)
        this._chatService.pushMsg({ id: id, name: user, userId: userid, text: msg, date: date, time: time });
      this.chatBodyScroll();
    });
  }

  chatBodyScroll() {
    setTimeout(() => {
      let chatBody = document.getElementById('chatBody');
      if (chatBody != undefined && chatBody != null)
        chatBody.scrollTo(0, chatBody.scrollHeight);
    }, 0);
  }

}
