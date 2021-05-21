import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { from, Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { UserService } from "../shared/user.service";
import * as $ from 'jquery';
import { LoaderService } from "../shared/loader.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private router: Router, private service: UserService,public loader: LoaderService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{    
        this.loader.isLoading.next(true);     
        if(localStorage.getItem('loggedUser') != null){
            const cloneReq = req.clone({
                headers: req.headers.set('Authorization','Bearer ' + this.service.currentUser.Token)
            });
            // console.log(this.service.currentUser.Token);
            return next.handle(cloneReq).pipe(
                tap(
                    succ => {},
                    err => {
                        if(err.status == 401){
                            console.log('passed');
                            localStorage.removeItem('loggedUser');
                            this.router.navigate(['/login']);
                        }
                    } 
                ),
                finalize(
                    () => {
                        this.loader.isLoading.next(false);
                    }
                )
            )
        }
        else{
            return next.handle(req).pipe(
                finalize(
                    () => {
                        this.loader.isLoading.next(false);
                    }
                )
            );
        }
    }
}