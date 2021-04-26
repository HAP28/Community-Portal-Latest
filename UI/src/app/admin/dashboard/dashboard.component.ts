import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userDetails : any;
  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.service.getUserProfile().subscribe(
      (res) => {
        this.userDetails = res;
        console.log(this.userDetails);
      }, (err) => {
        console.log(err);
      }
    );
  }
}
