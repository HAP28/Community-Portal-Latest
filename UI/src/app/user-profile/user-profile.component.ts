import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  title = 'user-profile';

  constructor(private _router : Router) { }

  ngOnInit(): void {
  }

  close(){
    this._router.navigate(['/'])
  }
  createarticle(){
    this._router.navigate(['article-create'])
  }
}