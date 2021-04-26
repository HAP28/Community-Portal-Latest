import { Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryList: any
  faArrowRight = faArrowRight;
  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList(){
    this.service.getCategory().subscribe(
      (res) => {
        this.categoryList = res;
        console.log(res);
      },(err) => {
        console.log(err);
      }
    )
  }
}
