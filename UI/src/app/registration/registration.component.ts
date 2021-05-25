import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  title: 'registration';
  showModal: boolean;
  submitted = false;
  showError = false;
  errorMessage = '';
  public showSuccess: boolean = false;

  constructor(
    public service: UserService,
    private formBuilder: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (this.service.currentUser !== null) {
      this._router.navigate(['/home']);
    }
    // this.confirmEmail();
  }

  onSubmit() {
    this.showError = false;
    this.showSuccess = false;
    this.submitted = true;
    // stop here if form is invalid
    if (this.service.formModel.invalid) {
      return;
    }
    if (this.submitted) {
      this.service.register().subscribe(
        (res: any) => {
          console.log(res);
          this.service.formModel.reset();
          for (var name in this.service.formModel.controls) {
            this.service.formModel.controls[name].setErrors(null);
          }
          //this._router.navigate(['/emailconfirm']);
          this.showModal = false;
          console.log(
            'WOW!! You have successfully Registered..Directing to Login'
          );
          this.showSuccess = true;
          //alert('Check your email for confirmation');
        },
        (err) => {
          console.log(err);
          this.errorMessage = err.error;
          this.showError = true;
        }
      );
    }
  }
  gotologin() {
    this._router.navigate(['/login']);
  }
  close() {
    this._router.navigate(['/']);
  }
}
