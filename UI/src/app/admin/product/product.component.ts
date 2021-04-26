import { Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productList: any
  faArrowRight = faArrowRight;
  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList(){
    this.service.getProducts().subscribe(
      (res) => {
        this.productList = res;
        console.log(res);
      },(err) => {
        console.log(err);
      }
    )
  }

}
