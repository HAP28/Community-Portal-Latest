import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userDetails : any;
  articleCount = 0;
  categoryCount = 0;
  productCount = 0;
  sectionCount = 0;
  userCount = 0;
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
    this.service.countTotalUsers().subscribe(
      (res) => {
        this.userCount = res[0].Column1;
      }
    );
    this.service.getCountArticles().subscribe(
      (res) => {
        this.articleCount = res[0].Column1;
      }
    );
    this.service.getCountProducts().subscribe(
      (res) => {
        this.productCount = res[0].Column1;
      }
    );
    this.service.countCategory().subscribe(
      (res) => {
        this.categoryCount = res[0].Column1;
      }
    );
    this.service.countSection().subscribe(
      (res) => {
        this.sectionCount = res[0].Column1;
      }
    );;
  }
}
