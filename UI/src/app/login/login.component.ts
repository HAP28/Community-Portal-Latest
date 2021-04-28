import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'login';
  showModal: boolean;
  loginForm: FormGroup;
  submitted = false;
  formModel = {
    email: '',
    password: ''
  }
    // userDetails: any;
  constructor(private formBuilder: FormBuilder, private _router : Router,private service: UserService) { }
  
  ngOnInit(): void {
    // //Add User form validations
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
     
      password: ['', [Validators.required, Validators.minLength(6),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]]
      });
  }

  get f() { return this.loginForm.controls; }
  
  onSubmit(form) {
    console.log(form.value);
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    if(this.submitted)
    {
      this.service.login(form.value).subscribe(
        (res:any)=>{
          console.log(JSON.stringify(res.body));
          localStorage.setItem('loggedUser',JSON.stringify(res.body));
          this._router.navigateByUrl('/home');
          console.log("WOW!! You have successfully logged in");
        },
        (err:any)=>{
          if(err.status == 400){
            alert('Incorrect Username or Password');
          } else if(err.status == 404){
            alert('User doesnt exist! Please check the Email address');
          } 
          else{
            console.log('Error while connecting to the server' + err.message);        
          }
        }
      );
      this.showModal = false;
      // this._router.navigate(['/user-profile'])
    }
  }
  gotoregistration(){
      this._router.navigate(['/registration'])
  }
  close(){
    this._router.navigate(['/'])
  }

}
