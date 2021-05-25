import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-emailconfirm',
  templateUrl: './emailconfirm.component.html',
  styleUrls: ['./emailconfirm.component.css'],
})
export class EmailconfirmComponent implements OnInit {
  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;
  display = true;
  constructor(
    private _route: ActivatedRoute,
    private service: UserService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.confirmEmail();
  }
  private confirmEmail = () => {
    this.showError = this.showSuccess = false;
    const token = this._route.snapshot.queryParams['token'];
    const email = this._route.snapshot.queryParams['email'];
    console.log(token);
    console.log(email);
    this.service.confirmEmail(token, email).subscribe(
      (_) => {
        this.showSuccess = true;
      },
      (error) => {
        console.log(error);
        this.showError = true;
        this.errorMessage = error;
      }
    );
  };
  close() {
    this.route.navigate(['/']);
  }
}
