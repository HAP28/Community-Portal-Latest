import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedIn : boolean = false;
  title = 'user-profile';
  userDetails : any;
  admin = false;
  constructor(private _router : Router,private service:UserService) { }

  ngOnInit(): void {
    if(localStorage.getItem('loggedUser')!= null){
      this.service.getUserProfile().subscribe(
        (res) => {
          this.userDetails = res;
          console.log(this.userDetails);
          if(this.service.currentUser.Role == "Admin"){
            // $('#dashboard').show();
            this.admin = true;
          }
          this.loggedIn = true;
        }, (err) => {
          console.log(err);
        }
      );
    }
  }
  login(){
    if(localStorage.getItem('loggedUser')==null)
    {
      this.loggedIn = true;
      this._router.navigate(['/login']);
    }
  }
  logout(){
    alert('logged out');
    localStorage.removeItem('loggedUser');
    this._router.navigate(['/']);
    this.loggedIn = false;
  }

  createarticle(){
    this._router.navigate(['article-create'])
  }
  dashboard(){
    this._router.navigate(['/dashboard']);
  }
  profile(){
    this._router.navigate(['/profile']);
  }
}
