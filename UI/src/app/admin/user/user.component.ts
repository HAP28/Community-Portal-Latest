import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  user: any;
  roleList: any;
  flag = 0;
  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getAllUsers().subscribe(
      (res) => {
        this.user = res;
        console.log(res);
        for (let i = 0; i < this.user.length; i++) {
          this.service.getUserRoles(this.user[i].Id).subscribe(
            (res) => {
              this.roleList = res;
              this.roleList['UserRoles'].forEach((elementX) => {
                if (elementX['Selected'] == true) {
                  this.flag = 1;
                  this.user[i].Role = elementX['RoleName'];
                }
              });
              if (this.flag == 0) {
                this.user[i].Role = 'No roles';
              } else {
                this.flag = 0;
              }
            },
            (err) => {
              console.log('error occured while fetch roles ' + err);
            }
          );
        }
        console.log(this.user);
      },
      (err) => {
        console.log('error occured in fetching list of users' + err);
      }
    );
    // console.log(this.roleList);
  }
}
