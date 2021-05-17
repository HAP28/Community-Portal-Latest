import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  title: 'registration';
  showModal: boolean;
  submitted = false;

  constructor(public service: UserService,private formBuilder: FormBuilder, private _router: Router) { }
  
  ngOnInit(): void { 
    if(this.service.currentUser !== null){
      this._router.navigate(['/home']);
    }
   }
  
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.service.formModel.invalid) {
      return;
  }
    if(this.submitted)
    {
      this.service.register().subscribe(
        (res : any) => {
          console.log(res);
            this.service.formModel.reset();
            this._router.navigate(['/login'])
            this.showModal = false;
            console.log("WOW!! You have successfully Registered..Directing to Login");
        },
        (err) => 
        {
          alert(err.error);
        }
      );
    }
  }
  gotologin(){
    this._router.navigate(['/login'])
  }
  close(){
    this._router.navigate(['/'])
  }
}
