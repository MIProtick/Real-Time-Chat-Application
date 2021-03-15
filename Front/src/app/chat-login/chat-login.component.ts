import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-chat-login',
  templateUrl: './chat-login.component.html',
  styleUrls: ['./chat-login.component.css']
})
export class ChatLoginComponent implements OnInit {
  public email: string = "";
  public password: string = "";
  public errMsg: string = '';

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
  }

  // Preprocess
  emailValidation() {
    const emailRegx = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/
    return emailRegx.test(this.email);
  }
  passwordValidation() {
    if (this.password.length >= 6 && this.password != "") return true;
    return false;
  }
  checkValidation() {
    if (!this.emailValidation()) this.errMsg = "Email is invalid.";
    else if (!this.passwordValidation()) this.errMsg = "Password should be at least 6 character!!";
    else return true;

    return false
  }

  async authenticateUser() {
    if (this.checkValidation()) {
      let isAuthnticate = await this._authService.authenticateUser(this.email, this.password);
      if (isAuthnticate) this._router.navigate(['chathome']);
      else {
        this.email = "";
        this.password = "";
        alert("LogIn Failed");
      }
    }
    else alert(this.errMsg);
  }

}
