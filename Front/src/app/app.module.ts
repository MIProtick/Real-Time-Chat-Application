import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatHomeComponent } from './chat-home/chat-home.component';
import { ChatLoginComponent } from './chat-login/chat-login.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { ChatRegestrationComponent } from './chat-regestration/chat-regestration.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ChatHomeComponent,
    ChatLoginComponent,
    WelcomePageComponent,
    ChatRegestrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
