import { Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';
import { ThrowStmt } from '@angular/compiler';
import { concatMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  user: any;
  product: any;
  CategoryForm = {};
  categoryList: any;
  faArrowRight = faArrowRight;
  constructor(private service: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getCategory().subscribe(
      (res) => {
        this.categoryList = res;
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
    this.service.getProducts().subscribe(
      (res) => {
        this.product = res;
        for (var i = 0; i < this.product.length; i++) {
          //creates option tag
          console.log(this.product[i]);
          $('<option/>')
            .val(this.product[i].Product_Id)
            .html(this.product[i].Product_Name)
            .appendTo('#productselection');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onAddCat() {
    this.CategoryForm['categoryName'] = $('#cat_name').val();
    this.CategoryForm['categoryDescription'] = $('#cat_descrpt').val();
    this.service.getUserProfile().subscribe(
      (res) => {
        this.user = res;
        this.CategoryForm['id'] = this.user.Id;
        this.service.getProducts().subscribe(
          (res) => {
            this.product = res;
            console.log(this.product);
            this.CategoryForm['productId'] = $('#productselection').val();
            this.service.postCategory(this.CategoryForm).subscribe(
              (res) => {
                console.log(res);
                document.getElementById('closecategory').click();
                document.getElementById('cat_name').textContent = '';
                $('#productselection').text('Select Product');
                this.refreshList();
                this.toastr.success('Category Successfully Added', 'Success');
              },
              (err) => {
                console.log(err);
                this.toastr.error('Category Add Failed', 'Error');
              }
            );
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
    // console.log('ProductForm :', this.productForm);
  }
  onDeleteCat(id) {
    console.log('Id ', id);
    if (confirm('Are you sure you want to delete this Category ?')) {
      this.service.deleteCategorybyid(id).subscribe(
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
