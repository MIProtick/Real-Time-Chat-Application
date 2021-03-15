import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
  public welcomeMessage:string="Welcome To The Chat Application";
  public isNotNew:boolean=true;
  
  constructor(private _authService:AuthService, private _router:Router) { }

  ngOnInit(): void {
    if(this._authService.isAuthenticated()) this._router.navigate(['chathome']);
  }
  
  toogleAuthBtn(actvAuthBtn:HTMLDivElement, deActvAuthBtn:HTMLDivElement){
    actvAuthBtn.classList.toggle("active");
    deActvAuthBtn.classList.toggle("active");
    if (actvAuthBtn.id == "signInBtn")
      this.isNotNew=true;
    else if (actvAuthBtn.id == "signUpBtn")
      this.isNotNew=false;
  }

}
