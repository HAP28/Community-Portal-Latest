import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { PasswordConfirmationValidatorService } from 'src/app/shared/password-confirmation-validator-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string = '';
  private _token: string;
  private _email: string;
  public display = true;
  constructor(
    private service: UserService,
    private _passConfValidator: PasswordConfirmationValidatorService,
    private _route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl(''),
    });
    this.resetPasswordForm
      .get('confirm')
      .setValidators([
        Validators.required,
        this._passConfValidator.validateConfirmPassword(
          this.resetPasswordForm.get('password')
        ),
      ]);

    this._token = this._route.snapshot.queryParams['token'];
    this._email = this._route.snapshot.queryParams['email'];
  }

  public validateControl = (controlName: string) => {
    return (
      this.resetPasswordForm.controls[controlName].invalid &&
      this.resetPasswordForm.controls[controlName].touched
    );
  };
  public hasError = (controlName: string, errorName: string) => {
    return this.resetPasswordForm.controls[controlName].hasError(errorName);
  };
  public resetPassword = (resetPasswordFormValue) => {
    this.showError = this.showSuccess = false;
    const resetPass = { ...resetPasswordFormValue };
    const resetPassDto = {
      password: resetPass.password,
      confirmPassword: resetPass.confirm,
      token: this._token,
      email: this._email,
    };
    this.service.resetPassword(resetPassDto).subscribe(
      (_) => {
        this.showSuccess = true;
      },
      (error) => {
        this.showError = true;
        this.errorMessage = error.error.Errors;
        console.log(this.errorMessage);
      }
    );
  };
  close() {
    this.router.navigate(['/']);
  }
  login() {
    this.router.navigate(['/login']);
  }
}
