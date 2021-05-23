import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
export class ContactDetails {
  public name: string;
  public email: string;
  public subject: string;
  public message: string;
}
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  display = false;
  model = new ContactDetails();
  feedback: boolean;
  contactus: boolean = true;
  constructor(private service: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.feedback = false;
  }
  termsandcondition() {
    if ($('#terms').prop('checked')) {
      console.log('yes');
      this.contactus = false;
    }
    if (!$('#terms').prop('checked')) {
      console.log('no');
      this.contactus = true;
    }
  }
  onSubmit(form) {
    console.log(form.value);
    this.service.contactus(form.value).subscribe(
      (res) => {
        console.log(res);
        form.reset();
      },
      (err) => {
        if (err.status == 200) {
          console.log('Mail sent success');
          this.toastr.success('Thank you for reaching out to us', 'Success');
          form.reset();
          this.feedback = true;
        }
        //console.log(err);
      }
    );
  }
}
