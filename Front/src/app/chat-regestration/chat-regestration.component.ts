import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { userData } from '../iuserData';

@Component({
  selector: 'app-chat-regestration',
  templateUrl: './chat-regestration.component.html',
  styleUrls: ['./chat-regestration.component.css']
})
export class ChatRegestrationComponent implements OnInit {
  public userData: userData = { id: "", firstName: '', lastName: '', email: '', password: '' };
  public errMsg: string = '';

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
  }
  // Preprocess
  titleCase(str: string) {
    return str.toLowerCase().split(' ').map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }
  emailValidation() {
    const emailRegx = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/
    return emailRegx.test(this.userData.email);
  }
  passwordValidation() {
    if (this.userData.password.length >= 6 && this.userData.password != "") return true;
    return false;
  }
  checkvalidation() {
    if (!this.emailValidation()) this.errMsg = "Email is invalid.";
    else if (!this.passwordValidation()) this.errMsg = "Password should be at least 6 character!!";
    else return true;

    return false
  }

  // Register Method
  async registerUser() {
    if (this.checkvalidation()) {
      let regComplete = await this._authService.registerUser(this.userData.firstName, this.userData.lastName, this.userData.email, this.userData.password);
      if (regComplete) {
        let isAuthnticate = await this._authService.authenticateUser(this.userData.email, this.userData.password);
        if (isAuthnticate) this._router.navigate(['chathome']);
        else {
          this.userData = { id: "", firstName: '', lastName: '', email: '', password: '' };
          alert("LogIn Failed");
          this._router.navigate(['']);
        }
      }
      else alert("Registration Failed");
    }
    else alert(this.errMsg);
  }
}
