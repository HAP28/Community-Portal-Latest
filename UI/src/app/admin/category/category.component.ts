import { Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';
import { ThrowStmt } from '@angular/compiler';
import { concatMapTo } from 'rxjs/operators';
import { AmdDependency } from 'typescript';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  user: any;
  product: any;
  CategoryForm = {};
  editCategoryForm = {};
  categoryName: any;
  editcategory: any;
  categoryList: any;
  productbyid: any;
  fullname: any;
  viewcategory: any;
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
            console.log('All products ', this.product);
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
  clearProductList() {
    $('#editproductselection')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Choose Product</option>')
      .val('');
  }
  populateCategory(catid) {
    this.clearProductList();
    this.loadproducts();
    this.service.getCategoryById(catid).subscribe(
      (res) => {
        this.editcategory = res;
        this.editCategoryForm['id'] = this.editcategory[0].User_Id;
        console.log('cat response', this.editcategory);
        this.service.getUserById(this.editcategory[0].User_Id).subscribe(
          (res) => {
            this.fullname = res['FirstName'] + ' ' + res['LastName'];
          },
          (err) => {
            console.log(err);
          }
        );
        this.categoryName = this.editcategory[0].Category_Name;
        $('#catname').val(this.editcategory[0].Category_Name);
        $('#catdesc').val(this.editcategory[0].Category_Description);
        $('#editproductselection')
          .val('' + this.editcategory[0].Product_Id)
          .change();
        // this.service.getProductsById(this.editcategory[0].Product_Id).subscribe(
        //   (res) => {
        //     this.productbyid = res;
        //     console.log('Pname ', this.productbyid[0].Product_Name);
        //     $('#editproductselection')
        //       // .find('option')
        //       .val('' + this.editcategory[0].Product_Id)
        //       .html('' + this.productbyid[0].Product_Name);
        //   },
        //   (err) => {
        //     console.log(err);
        //   }
        // );
      },
      (err) => {
        console.log(err);
      }
    );
  }
  loadproducts() {
    this.service.getProducts().subscribe(
      (res) => {
        this.product = res;
        for (var i = 0; i < this.product.length; i++) {
          //creates option tag
          console.log(this.product[i]);
          $('<option/>')
            .val(this.product[i].Product_Id)
            .html(this.product[i].Product_Name)
            .appendTo('#editproductselection');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  updateCategory(id) {
    console.log(id);
    this.editCategoryForm['categoryId'] = id;
    this.editCategoryForm['categoryName'] = $('#catname').val();
    this.editCategoryForm['categoryDescription'] = $('#catdesc').val();
    this.editCategoryForm['productId'] = $('#editproductselection').val();
    console.log('final data to update ', this.editCategoryForm);
    this.service.updateCategory(this.editCategoryForm).subscribe(
      (res) => {
        console.log(res);
        this.toastr.success(res.toString(), 'Success');
        this.clearUpdateForm();
      },
      (err) => {
        this.toastr.error(err.toString(), 'Failed');
        console.log(err);
      }
    );
  }
  clearUpdateForm() {
    $('#catname').val('');
    $('#catdesc').val('');
    this.clearProductList();
    document.getElementById('closewindow').click();
    this.refreshList();
  }
  viewspecificCategory(id) {
    this.service.getCategoryById(id).subscribe(
      (res) => {
        this.viewcategory = res[0];
        console.log(this.viewcategory);
        $('#viewcategoryname').text(this.viewcategory.Category_Name);
        $('#categorydescription').text(this.viewcategory.Category_Description);

        this.service.getUserById(this.viewcategory.User_Id).subscribe(
          (res) => {
            $('#username').text(
              'Category Created by ' + res['FirstName'] + ' ' + res['LastName']
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
  }
}
