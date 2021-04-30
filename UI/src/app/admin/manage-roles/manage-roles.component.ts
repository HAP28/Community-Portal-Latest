import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.css'],
})
export class ManageRolesComponent implements OnInit {
  userList: any;
  userRole: any;
  userRolesNew = {};
  finaldata: any;
  userid: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    let id;
    this.activatedRoute.queryParams.subscribe((params) => {
      id = params['id'];
      this.userid = id;
      console.log(id); // Print the parameter to the console.
    });
    this.service.getAllUsers().subscribe(
      (res) => {
        this.userList = res;
        console.log(this.userList);
        this.userList.forEach((element) => {
          if (element.Id == id) {
            $('#head').text('Manage Roles for ' + element.FirstName);
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
    this.refreshList(id);
  }
  refreshList(id) {
    this.service.getUserRoles(id).subscribe(
      (res) => {
        this.userRole = res;
        this.finaldata = this.userRole.UserRoles;
        console.log('User', res);
        this.userRolesNew['userId'] = id;
        for (var i = 0; i < this.userRole.UserRoles.length; i++) {
          if (this.userRole.UserRoles[i].Selected) {
            $('#' + i.toString()).prop('checked', true);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  Onsubmit() {
    for (var i = 0; i < 4; i++) {
      this.finaldata[i].Selected = $('#' + i.toString()).prop('checked');
    }
    this.userRolesNew['userRoles'] = this.finaldata;
    console.log(this.userRolesNew);
    this.service.putUserRoles(this.userid, this.userRolesNew).subscribe(
      (res) => {
        this.refreshList(this.userid);
        this.toastr.success('User Roles Updates Successfully', 'Success');
        console.log(res);
      },
      (err) => {
        console.log(err);
        this.toastr.error('User Roles Failed to update', 'Error');
      }
    );
  }
}
