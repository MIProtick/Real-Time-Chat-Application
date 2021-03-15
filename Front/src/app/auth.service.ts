import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpGeneralRes } from './iHttpGeneralRes';
import { userData } from './iuserData';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData: userData = { id: "", firstName: "", lastName: "", email: "", password: "" };

  constructor(private _http: HttpClient) { }

  isAuthenticated() {
    if (this.userData.id == "" || this.userData.firstName == "") return false;
    else return true;
  }

  getUserData() {
    return this.userData;
  }

  resetAuthService() {
    this.userData = { id: "", firstName: "", lastName: "", email: "", password: "" };
  }

  // Login credentials
  async authenticateUser(email: string, password: string) {
    let url = 'http://localhost:5000/api/auth/login';
    let isAuthenticated = false;
    await this._http.post<httpGeneralRes>(url, { "Email": email, "Password": password }).toPromise()
      .then((data) => {
        if (data.status == "Succeed") {
          isAuthenticated = true;
          this.userData = { ...data.result };
        }
        else alert("LogIn Failed");
      });
    return isAuthenticated;
  }

  // Registration Credentials
  async registerUser(firstname: string, lastName: string, email: string, password: string) {
    let url = 'http://localhost:5000/api/auth/register';
    let regComplete = false;
    await this._http.post<httpGeneralRes>(url, { "FirstName": firstname, "LastName": lastName, "Email": email, "Password": password }).toPromise()
      .then((data) => {
        if (data.status == "Succeed") {
          regComplete = true;
        } else if (data.status == "ExistAuthFailure") alert("This email is already exists!");
        else alert("failed to register!");
      });
    return regComplete;
  }

  // Logout Credentials
  async signOut() {
    let url = 'http://localhost:5000/api/auth/logout';
    let isLogout = false;
    await this._http.post<httpGeneralRes>(url, this.userData).toPromise()
      .then(data => {
        this.userData = { ...data.result };
        isLogout = true;
      });
    return isLogout;
  }

}
