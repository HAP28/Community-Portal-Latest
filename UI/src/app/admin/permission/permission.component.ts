import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css'],
})
export class PermissionComponent implements OnInit {
  roleClaims: any;
  permissionObj = {};
  RoleClaimsNew: any;
  rolesList: any;
  roleid: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    let id;
    this.activatedRoute.queryParams.subscribe((params) => {
      id = params['id'];
      this.roleid = id;
      console.log(id); // Print the parameter to the console.
    });
    this.service.getRoles().subscribe(
      (res) => {
        this.rolesList = res;
        console.log(this.rolesList);
        this.rolesList.forEach((element) => {
          if (element.Id == id) {
            $('#head').text('Permissions for ' + element.Name);
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
    this.service.getPermissionByRoles(id).subscribe(
      (res) => {
        this.roleClaims = res;
        this.permissionObj['RoleId'] = this.roleClaims.RoleId;
        this.RoleClaimsNew = this.roleClaims.RoleClaims;
        console.log(this.roleClaims);

        for (var i = 0; i < this.roleClaims.RoleClaims.length; i++) {
          console.log(this.roleClaims.RoleClaims[i]);
          if (this.roleClaims.RoleClaims[i].Selected) {
            $('#' + i.toString()).prop('checked', true);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  submitForm() {
    for (var i = 0; i < 4; i++) {
      this.RoleClaimsNew[i].Selected = $('#' + i.toString()).prop('checked');
    }
    this.permissionObj['RoleClaims'] = this.RoleClaimsNew;
    this.service.putPermissionByRoles(this.permissionObj).subscribe(
      (res) => {
        console.log(res);
        this.refreshList(this.roleid);
        this.toastr.success('Roles Permission Updated Successfully', 'Success');
      },
      (err) => {
        console.log(err);
        this.toastr.success('Roles Permission Update Failed', 'Error');
      }
    );
    // console.log(this.permissionObj);
  }
}
