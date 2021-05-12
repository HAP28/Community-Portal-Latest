import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /**
   *
   */
  constructor(private router : Router,private service: UserService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.service.currentUser;
      if (currentUser == null){
          alert("You don't have a permission to access this page.");
          this.router.navigate(['/home']);
          return false;
      }
      else{
          if(route.data.roles && route.data.roles.indexOf(currentUser.Role)===-1){
              alert("You don't have a permission to access this page.");
              this.router.navigate(['/home']);
              return false;
          }
          return true;
      }
  }

}
