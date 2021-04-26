import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  categoryList : any;
  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.refreshList()
  }

  refreshList(){
    this.service.getCategories().subscribe(
      (res) => {
        console.log(res);
        this.categoryList = res;
      },
      (err) => {
        console.log(err);
      }
    )
  }
}
