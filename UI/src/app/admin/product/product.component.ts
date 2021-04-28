import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
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
  productform!: FormGroup;
  submitted = false;
  constructor(private service: UserService, private toastr: ToastrService,private formBuilder:FormBuilder) {}

  ngOnInit(): void {
    this.refreshList();
    this.productform = this.formBuilder.group({
      product: ['', [Validators.required]],
     
     
      });
  }

  get f() { return this.productform.controls; }
  onSubmit() {
    // alert('j');
    this.submitted = true;
    // stop here if form is invalid
    if (this.productform.invalid) {
        return;
    }
    if(this.submitted)
    {
      console.log('validation checked');
    }
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
            console.log();
            if(err.error.errors.ProductDescription[0]){
              this.toastr.error('Description is required', 'Product Add Failed');
            }else{
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
}
