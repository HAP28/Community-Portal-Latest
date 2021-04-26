import { Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {

  sectionList: any
  sectionForm = {}
  categoryList: any
  user: any
  category: any
  faArrowRight = faArrowRight;

  constructor(private service: UserService, private toastr: ToastrService) { }

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

  AddSection(){
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

  DeleteSection(id){
    console.log('Id ', id);
    if (confirm('Are you sure you want to delete this Category ?')) {
      this.service.deleteSectionbyid(id).subscribe(
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
