import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

  roleClaims: any;
  constructor(private activatedRoute: ActivatedRoute,private service: UserService) {
    let id;
    this.activatedRoute.queryParams.subscribe(params => {
      id = params['id'];
      console.log(id); // Print the parameter to the console. 
    });
    this.refreshList(id);
   }

  ngOnInit(): void {
  }

  refreshList(id){
    this.service.getPermissionByRoles(id).subscribe(
      (res) => {
        this.roleClaims = res
        for(var i=0;i<this.roleClaims.RoleClaims;i++){
          if(this.roleClaims.RoleClaims[i].Selected){
            $('#'+i).prop('checked',true);
            // document.getElementById(i.toString()).checked = true;
          }
        }
      },(err) => {
        console.log(err);
      }
    )
  }
}
