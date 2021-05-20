import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
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
  updateProductForm = {};
  faArrowRight = faArrowRight;
  productform!: FormGroup;
  editProduct: any;
  getusername: any;
  userid: any;
  submitted = false;
  productname: any;
  viewproduct: any;

  searchText = '';
  characters = []

  constructor(
    private service: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshList();
    this.productform = this.formBuilder.group({
      product: ['', [Validators.required]],
    });
  }

  get f() {
    return this.productform.controls;
  }
  onSubmit() {
    // alert('j');
    this.submitted = true;
    // stop here if form is invalid
    if (this.productform.invalid) {
      return;
    }
    if (this.submitted) {
      console.log('validation checked');
    }
  }

  refreshList() {
    this.service.getProducts().subscribe(
      (res) => {
        this.productList = res;
        console.log(res);
        this.productList.forEach(element => {
          this.characters.push({'id':element.Product_Id ,'name' :element.Product_Name});
        });
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
            console.log();
            if (err.error.errors.ProductDescription[0]) {
              this.toastr.error(
                'Description is required',
                'Product Add Failed'
              );
            } else {
              this.toastr.error('Product Add Failed', 'Error');
            }
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
  populateProduct(id) {
    console.log(id);
    this.service.getProductsById(id).subscribe(
      (res) => {
        console.log('getproductbyid', res);
        this.editProduct = res;
        this.userid = this.editProduct[0].User_Id;
        this.productname = this.editProduct[0].Product_Name;
        console.log(this.editProduct[0].Product_Description);
        $('#pname').val(this.editProduct[0].Product_Name);
        $('#editdesc').val(this.editProduct[0].Product_Description);
        this.service.getUserById(this.editProduct[0].User_Id).subscribe(
          (res) => {
            this.getusername = res['FirstName'] + ' ' + res['LastName'];
            console.log(this.getusername);
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
  updateProduct(id) {
    console.log('Product id: ', id);
    this.updateProductForm['productId'] = id;
    this.updateProductForm['productName'] = $('#pname').val();
    this.updateProductForm['productDescription'] = $('#editdesc').val();
    this.updateProductForm['id'] = this.userid;
    this.service.updateProduct(this.updateProductForm).subscribe(
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
    $('#pname').val('');
    $('#editdesc').val('');
    document.getElementById('closewindow').click();
    this.refreshList();
  }
  viewspecificProduct(id) {
    this.service.getProductsById(id).subscribe(
      (res) => {
        this.viewproduct = res[0];
        console.log(this.viewproduct);
        $('#viewproductname').text(this.viewproduct.Product_Name);
        $('#productdescription').text(this.viewproduct.Product_Description);

        this.service.getUserById(this.viewproduct.User_Id).subscribe(
          (res) => {
            $('#username').text(
              'Product Created by ' + res['FirstName'] + ' ' + res['LastName']
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
