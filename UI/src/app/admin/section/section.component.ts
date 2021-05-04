import { Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent implements OnInit {
  sectionList: any;
  sectionForm = {};
  editsection: any;
  editsectionForm = {};
  categoryList: any;
  user: any;
  category: any;
  fullname: any;
  sectionName: any;
  cat: any;
  viewsection: any;
  faArrowRight = faArrowRight;

  constructor(private service: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getSection().subscribe(
      (res) => {
        this.sectionList = res;
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
    this.service.getCategory().subscribe(
      (res) => {
        this.categoryList = res;
        for (var i = 0; i < this.categoryList.length; i++) {
          //creates option tag
          console.log(this.categoryList[i]);
          $('<option/>')
            .val(this.categoryList[i].Category_Id)
            .html(this.categoryList[i].Category_Name)
            .appendTo('#categoryselection');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  AddSection() {
    this.sectionForm['SectionName'] = $('#section_name').val();
    this.sectionForm['SectionDescription'] = $('#section_description').val();
    this.service.getUserProfile().subscribe(
      (res) => {
        this.user = res;
        this.sectionForm['id'] = this.user.Id;
        this.service.getProducts().subscribe(
          (res) => {
            this.category = res;
            console.log(this.category);
            this.sectionForm['categoryId'] = $('#categoryselection').val();
            this.service.postSection(this.sectionForm).subscribe(
              (res) => {
                console.log(res);
                document.getElementById('closesection').click();
                document.getElementById('section_name').textContent = '';
                $('#categoryselection').text('Select Category');
                this.refreshList();
                this.toastr.success('Section Successfully Added', 'Success');
              },
              (err) => {
                console.log(err);
                this.toastr.error('Section Add Failed', 'Error');
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
  }

  DeleteSection(id) {
    console.log('Id ', id);
    if (confirm('Are you sure you want to delete this Category ?')) {
      this.service.deleteSectionbyid(id).subscribe(
        (res) => {
          this.refreshList();
          this.toastr.success(res.toString(), 'Delete');
        },
        (err) => {
          this.toastr.error(err.toString(), 'Failed');
        }
      );
    }
  }
  clearCategoryList() {
    $('#editcategoryselection')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Choose Category</option>')
      .val('');
  }
  populateSection(secid) {
    this.clearCategoryList();
    this.loadcategories();
    this.service.getSectionById(secid).subscribe(
      (res) => {
        this.editsection = res;
        console.log('get section', this.editsection);
        this.editsectionForm['id'] = this.editsection[0].User_Id;
        console.log('section response', this.editsection);
        this.service.getUserById(this.editsection[0].User_Id).subscribe(
          (res) => {
            this.fullname = res['FirstName'] + ' ' + res['LastName'];
          },
          (err) => {
            console.log(err);
          }
        );
        this.sectionName = this.editsection[0].Section_Name;
        $('#secname').val(this.editsection[0].Section_Name);
        $('#secdesc').val(this.editsection[0].Section_Description);
        $('#editcategoryselection')
          .val('' + this.editsection[0].Category_Id)
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
  loadcategories() {
    this.service.getCategory().subscribe(
      (res) => {
        this.cat = res;
        for (var i = 0; i < this.cat.length; i++) {
          //creates option tag
          console.log(this.cat[i]);
          $('<option/>')
            .val(this.cat[i].Category_Id)
            .html(this.cat[i].Category_Name)
            .appendTo('#editcategoryselection');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  updateSection(id) {
    console.log(id);
    this.editsectionForm['sectionId'] = id;
    this.editsectionForm['sectionName'] = $('#secname').val();
    this.editsectionForm['sectionDescription'] = $('#secdesc').val();
    this.editsectionForm['categoryId'] = $('#editcategoryselection').val();
    console.log('final data to update ', this.editsectionForm);
    this.service.updateSection(this.editsectionForm).subscribe(
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
    $('#secname').val('');
    $('#secdesc').val('');
    this.clearCategoryList();
    document.getElementById('closewindow').click();
    this.refreshList();
  }
  viewspecificSection(id) {
    this.service.getSectionById(id).subscribe(
      (res) => {
        this.viewsection = res[0];
        console.log(this.viewsection);
        $('#viewsectionname').text(this.viewsection.Section_Name);
        $('#sectiondescription').text(this.viewsection.Section_Description);

        this.service.getUserById(this.viewsection.User_Id).subscribe(
          (res) => {
            $('#username').text(
              'Section Created by ' + res['FirstName'] + ' ' + res['LastName']
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
