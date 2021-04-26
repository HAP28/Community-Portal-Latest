import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  rolesList: any
  constructor(private _router: Router,private service: UserService) { }

  ngOnInit(): void {
    this.refreshList()
  }
  
  permission(id){
    this._router.navigateByUrl('/permission?id='+ id);
  }

  refreshList(){
    this.service.getRoles().subscribe(
      (res) => {
        this.rolesList = res;
        console.log(this.rolesList);
        
      },(err) => {
        console.log(err);
      }
    )
  }
}
