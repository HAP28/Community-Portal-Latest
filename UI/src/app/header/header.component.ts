import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import * as $ from 'jquery';
import { LoaderService } from '../shared/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() display: boolean;

  loggedIn: boolean = false;
  title = 'user-profile';
  userDetails: any;
  admin = false;
  constructor(
    private _router: Router,
    private service: UserService,
    public loader: LoaderService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('loggedUser') != null) {
      this.service.getUserProfile().subscribe(
        (res) => {
          this.userDetails = res;
          this.loggedIn = true;
          console.log(this.userDetails);
          if (this.service.currentUser.Role == 'Admin') {
            // $('#dashboard').show();
            this.admin = true;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  login() {
    if (localStorage.getItem('loggedUser') == null) {
      // this.loggedIn = true;
      this._router.navigate(['/login']);
    }
  }
  logout() {
    if (confirm('Are you sure you want to Logout')) {
      localStorage.removeItem('loggedUser');
      this._router.navigate(['/']);
      this.loggedIn = false;
    } else {
      this._router.navigate(['/home']);
      this.loggedIn = true;
    }
    //alert('logged out');
  }

  createarticle() {
    this._router.navigate(['article-create']);
  }
  dashboard() {
    this._router.navigate(['/dashboard']);
  }
  profile() {
    this._router.navigate(['/profile']);
  }
  contact() {
    this._router.navigate(['/contact-us']);
  }
  about() {
    this._router.navigate(['/about']);
  }
}
