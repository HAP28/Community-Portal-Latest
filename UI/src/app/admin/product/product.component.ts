import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  productList: any;
  user: any;
  productForm = {};
  faArrowRight = faArrowRight;
  constructor(private service: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getProducts().subscribe(
      (res) => {
        this.productList = res;
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  OnproductSubmit() {
    this.productForm['productName'] = $('#Product_Name').val();
    this.productForm['productDescription'] = $('#Product_Description').val();
    this.service.getUserProfile().subscribe(
      (res) => {
        this.user = res;
        this.productForm['id'] = this.user.Id;
        this.service.postProduct(this.productForm).subscribe(
          (res) => {
            console.log(res);
            document.getElementById('closeproduct').click();
            $('#Product_Name').text('');
            this.refreshList();
            this.toastr.success('Product Successfully Added', 'Success');
          },
          (err) => {
            console.log(err);
            this.toastr.error('Product Add Failed', 'Error');
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
    console.log('ProductForm :', this.productForm);
  }
  deleteProduct(id) {
    console.log('Id ', id);
    if (confirm('Are you sure you want to delete this product ?') == true) {
      this.service.deleteProductbyid(id).subscribe(
        (res) => {
          this.refreshList();
          this.toastr.success(res.toString(), 'Delete');
        },
        (err) => {
          this.toastr.success(err.toString(), 'Failed');
        }
      );
    }
  }
}
