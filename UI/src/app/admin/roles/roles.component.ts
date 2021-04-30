import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  rolesList: any;
  roleName = {};
  constructor(
    private _router: Router,
    private service: UserService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.refreshList();
  }

  permission(id) {
    this._router.navigateByUrl('/permission?id=' + id);
  }

  refreshList() {
    this.service.getRoles().subscribe(
      (res) => {
        this.rolesList = res;

        console.log('Role ', this.rolesList);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  addRole() {
    //this.roleName['roleName'] = $('#roleName').val();
    //console.log('Rolename ', this.roleName);

    this.service.addRoles($('#roleName').val()).subscribe(
      (res) => {
        this.refreshList();
        //console.log('Added role ', res);
      },
      (err) => {
        if (err.status == 200) {
          this.toast.success('Roles Added', 'Success');
          this.refreshList();
          console.log('Added Roles err ', err);
        }
      }
    );
  }
  deleteRole(id) {
    console.log(id);
    if (confirm('Are you sure you want to delete the role ?')) {
      this.service.deleteRoles(id).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
          if (err.status == 200) {
            this.toast.success('Role Deleted', 'Success');
            this.refreshList();
          }
        }
      );
    }
  }
}
