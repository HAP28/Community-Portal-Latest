import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
declare var jQuery: any;
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userDetails: any;
  uid: any;
  userarticlecount: any;
  userarticlepublishcount: any;
  userarticledraftcount: any;
  userarticlearchivecount: any;
  country_arr: any;
  getuserarticles: any;
  editpersonaldata = {};
  display = false;
  mode: any;
  Role:any;
  atricleNotFound = true;
  dataFetched = false;
  constructor(private service: UserService, private router: Router) {}
  s_a: any;
  c_a: any;
  ngOnInit(): void {
    this.Role = this.service.currentUser.Role;
    this.getUserDetails();
    //this.addCounter();
    this.getCountries();
    //this.getCounts();
  }

  addCounter() {
    (function ($) {
      $(document).ready(function () {
        console.log('Counter Working!');
        $('.counter-count').each(function () {
          $(this)
            .prop('Counter', 0)
            .animate(
              {
                Counter: $(this).text(),
              },
              {
                duration: 7000,
                easing: 'swing',
                step: function (now) {
                  $(this).text(Math.ceil(now));
                },
              }
            );
        });
      });
    })(jQuery);
  }
  getUserDetails() {
    if (localStorage.getItem('loggedUser') != null) {
      this.service.getUserProfile().subscribe(
        (res) => {
          this.userDetails = res;
          this.dataFetched = true;
          this.uid = this.userDetails.Id;
          console.log('Userid ', this.userDetails);
          // append links to social media
          $('#fb').attr('href', this.userDetails.fb_link);
          $('#tw').attr('href', this.userDetails.tw_link);
          $('#ln').attr('href', this.userDetails.ln_link);
          this.getallarticles(this.uid);
          // this.service.getarticleforuser(this.uid).subscribe(
          //   (res) => {
          //     this.getuserarticles = res;
          //     // this.getuserarticles[0].PostedOn = this.formatdate(
          //     //   this.getuserarticles[0].PostedOn
          //     // );
          //     this.formatdate(this.getuserarticles);
          //     console.log('all user article ', this.getuserarticles);
          //   },
          //   (err) => {
          //     console.log(err);
          //   }
          // );
          this.getCounts(this.uid);
          console.log(this.userDetails);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  getallarticles(uid) {
    this.mode = 'publish';
    this.service.getarticleforuser(uid).subscribe(
      (res) => {
        
          this.atricleNotFound = false;          
          this.getuserarticles = res;
        this.formatdate(this.getuserarticles);
        console.log('all user article ', this.getuserarticles);
        
        
      },
      (err) => {
        if(err.status == 403){
          this.atricleNotFound = true;
        }
        this.atricleNotFound = true;
        console.log(err);
      }
    );
  }
  getCounts(userid) {
    this.service.getUserArticlesCount(userid).subscribe(
      (res) => {
        this.userarticlecount = res[0].Column1;
        console.log(this.userarticlecount);
      },
      (err) => {
        console.log(err);
      }
    );
    // Publish
    this.service
      .getUserArticlesCountForAll(userid, true, false, false)
      .subscribe(
        (res) => {
          this.userarticlepublishcount = res[0].Column1;
          console.log('Publish ', this.userarticlepublishcount);
        },
        (err) => {
          console.log(err);
        }
      );
    //Draft
    this.service
      .getUserArticlesCountForAll(userid, false, true, false)
      .subscribe(
        (res) => {
          this.userarticledraftcount = res[0].Column1;
          console.log('Draft ', this.userarticledraftcount);
        },
        (err) => {
          console.log(err);
        }
      );
    //Archive
    this.service
      .getUserArticlesCountForAll(userid, false, false, true)
      .subscribe(
        (res) => {
          this.userarticlearchivecount = res[0].Column1;
          console.log('Archive ', this.userarticlearchivecount);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getCountries() {
    this.country_arr = new Array(
      'Select Country',
      'AUSTRALIA',
      'INDIA',
      'NEW ZEALAND',
      'USA',
      'UAE',
      'MAURITIUS'
    );

    $.each(this.country_arr, function (i, item) {
      $('#country').append(
        $(
          '<option>',
          {
            value: i,
            text: item,
          },
          '</option>'
        )
      );
    });

    // States
    var s_a = new Array();
    s_a[0] = 'Select State';
    s_a[1] = 'Select State|QUEENSLAND|VICTORIA';
    s_a[2] =
      'Select State|ANDHRAPRADESH|KARNATAKA|TAMILNADU|DELHI|GOA|W-BENGAL|GUJARAT|MADHYAPRADESH|MAHARASHTRA|RAJASTHAN';
    s_a[3] = 'Select State|AUCKLAND';
    s_a[4] = 'Select State|NEWJERSEY|ILLINOIS';
    s_a[5] = 'Select State|DUBAI';
    s_a[6] = 'Select State|MAURITIUS';

    // Cities
    var c_a = new Array();
    c_a['QUEENSLAND'] = 'BRISBANE';
    c_a['VICTORIA'] = 'MELBOURNE';
    c_a['ANDHRAPRADESH'] = 'HYDERABAD';
    c_a['KARNATAKA'] = 'BANGLORE';
    c_a['TAMILNADU'] = 'CHENNAI';
    c_a['DELHI'] = 'DELHI';
    c_a['GOA'] = 'GOA';
    c_a['W-BENGAL'] = 'KOLKATA';
    c_a['GUJARAT'] = 'AHMEDABAD|BARODA|BHAVNAGAR|MEHSANA|RAJKOT|SURAT|UNA';
    c_a['MADHYAPRADESH'] = 'INDORE';
    c_a['MAHARASHTRA'] = 'MUMBAI|PUNE';
    c_a['RAJASTHAN'] = 'ABU';
    c_a['AUCKLAND'] = 'AUCKLAND';
    c_a['NEWJERSEY'] = 'EDISON';
    c_a['ILLINOIS'] = 'CHICAGO';
    c_a['MAURITIUS'] = 'MAURITIUS';
    c_a['DUBAI'] = 'DUBAI';

    $('#country').change(function () {
      var c = $(this).val();
      var state_arr = s_a[c].split('|');
      $('#state').empty();
      $('#city').empty();
      if (c == 0) {
        $('#state').append(
          $(
            '<option>',
            {
              value: '0',
              text: 'Select State',
            },
            '</option>'
          )
        );
      } else {
        $.each(state_arr, function (i, item_state) {
          $('#state').append(
            $(
              '<option>',
              {
                value: item_state,
                text: item_state,
              },
              '</option>'
            )
          );
        });
      }
      $('#city').append(
        $(
          '<option>',
          {
            value: '0',
            text: 'Select City',
          },
          '</option>'
        )
      );
    });

    $('#state').change(function () {
      var s = $(this).val();
      if (s == 'Select State') {
        $('#city').empty();
        $('#city').append(
          $(
            '<option>',
            {
              value: '0',
              text: 'Select City',
            },
            '</option>'
          )
        );
      }

      var city_arr = c_a[s].split('|');
      $('#city').empty();

      $.each(city_arr, function (j, item_city) {
        $('#city').append(
          $(
            '<option>',
            {
              value: item_city,
              text: item_city,
            },
            '</option>'
          )
        );
      });
    });
  }
  populateUserData() {
    this.s_a = new Array();
    this.s_a[0] = 'Select State';
    this.s_a[1] = 'Select State|QUEENSLAND|VICTORIA';
    this.s_a[2] =
      'Select State|ANDHRAPRADESH|KARNATAKA|TAMILNADU|DELHI|GOA|W-BENGAL|GUJARAT|MADHYAPRADESH|MAHARASHTRA|RAJASTHAN';
    this.s_a[3] = 'Select State|AUCKLAND';
    this.s_a[4] = 'Select State|NEWJERSEY|ILLINOIS';
    this.s_a[5] = 'Select State|DUBAI';
    this.s_a[6] = 'Select State|MAURITIUS';

    this.c_a = new Array();
    this.c_a['QUEENSLAND'] = 'BRISBANE';
    this.c_a['VICTORIA'] = 'MELBOURNE';
    this.c_a['ANDHRAPRADESH'] = 'HYDERABAD';
    this.c_a['KARNATAKA'] = 'BANGLORE';
    this.c_a['TAMILNADU'] = 'CHENNAI';
    this.c_a['DELHI'] = 'DELHI';
    this.c_a['GOA'] = 'GOA';
    this.c_a['W-BENGAL'] = 'KOLKATA';
    this.c_a['GUJARAT'] = 'AHMEDABAD|BARODA|BHAVNAGAR|MEHSANA|RAJKOT|SURAT|UNA';
    this.c_a['MADHYAPRADESH'] = 'INDORE';
    this.c_a['MAHARASHTRA'] = 'MUMBAI|PUNE';
    this.c_a['RAJASTHAN'] = 'ABU';
    this.c_a['AUCKLAND'] = 'AUCKLAND';
    this.c_a['NEWJERSEY'] = 'EDISON';
    this.c_a['ILLINOIS'] = 'CHICAGO';
    this.c_a['MAURITIUS'] = 'MAURITIUS';
    this.c_a['DUBAI'] = 'DUBAI';

    console.log('in edit', this.userDetails);
    $('#first-name').val(this.userDetails.FirstName);
    $('#last-name').val(this.userDetails.LastName);
    $('#email').val(this.userDetails.Email);
    $('#email').prop('disabled', true);

    $('#profession').val(this.userDetails.Profession);
    $('#contact').val(this.userDetails.PhoneNumber);

    let Countryindex = this.country_arr.findIndex(
      (x) => x === this.userDetails.Country
    );

    var state = this.s_a[Countryindex].split('|');
    console.log(state);
    let Stateindex = state.findIndex((x) => x === this.userDetails.State);
    console.log(Stateindex);
    $('#country').val(Countryindex);
    //console.log(this.country_arr.findIndex  [this.userDetails.Country]);
    $.each(state, function (i, item_state) {
      $('#state').append(
        $(
          '<option>',
          {
            value: item_state,
            text: item_state,
          },
          '</option>'
        )
      );
    });

    console.log(state[Stateindex]);
    $('#state')[0].selectedIndex = Stateindex;

    var city_arr = this.c_a[state[Stateindex]].split('|');
    console.log(city_arr[0]);
    let cityindex = city_arr.findIndex((x) => x === this.userDetails.City);
    $.each(city_arr, function (j, item_city) {
      $('#city').append(
        $(
          '<option>',
          {
            value: item_city,
            text: item_city,
          },
          '</option>'
        )
      );
    });

    $('#city')[0].selectedIndex = cityindex;
    $('#bio').val(this.userDetails.user_bio);
    $('#fb_link').val(this.userDetails.fb_link);
    $('#tw_link').val(this.userDetails.tw_link);
    $('#ln_link').val(this.userDetails.ln_link);
  }
  editpersonalinfo() {
    console.log(this.country_arr[$('#country').val()]);
    console.log($('#state').val());
    console.log($('#city').val());
    this.editpersonaldata['FirstName'] = $('#first-name').val();
    this.editpersonaldata['LastName'] = $('#last-name').val();
    this.editpersonaldata['Profession'] = $('#profession').val();
    this.editpersonaldata['PhoneNumber'] = $('#contact').val();
    this.editpersonaldata['Country'] = this.country_arr[$('#country').val()];
    this.editpersonaldata['State'] = $('#state').val();
    this.editpersonaldata['City'] = $('#city').val();
    this.editpersonaldata['user_bio'] = $('#bio').val();
    this.editpersonaldata['fb_link'] = $('#fb_link').val();
    this.editpersonaldata['tw_link'] = $('#tw_link').val();
    this.editpersonaldata['ln_link'] = $('#ln_link').val();
    console.log(this.editpersonaldata);
    this.service.updateuserprofile(this.uid, this.editpersonaldata).subscribe(
      (res) => {
        console.log(res);
        document.getElementById('close').click();
        this.getUserDetails();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  formatdate(articles) {
    for (var i = 0; i < articles.length; i++) {
      var date = new Date(articles[i].PostedOn);
      articles[i].PostedOn = date.toDateString();
    }
  }
  userpublisharticles() {
    this.mode = 'publish';
    this.service.getpublisharticleforuser(this.uid).subscribe(
      (res) => {
        this.getuserarticles = res;
        this.formatdate(this.getuserarticles);
        console.log(this.getuserarticles);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  userdraftarticles() {
    this.service.getdraftarticleforuser(this.uid).subscribe(
      (res) => {
        this.getuserarticles = res;
        this.formatdate(this.getuserarticles);
        console.log(this.getuserarticles);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  userarchivearticles() {
    this.service.getarchivearticleforuser(this.uid).subscribe(
      (res) => {
        this.getuserarticles = res;
        this.formatdate(this.getuserarticles);
        console.log(this.getuserarticles);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  readMore(article_id,s,d,a) {
    this.router.navigateByUrl('/article?page=profile&articleid=' + article_id + '&s='+ s + '&d=' + d + '&a=' + a);
    //this._router.navigateByUrl('/permission?id=' + id);
  }
  changePassword(){
    var body = {
      OldPassword: $('#old_password').val(),
      NewPassword: $('#new_password').val()
    }
    this.service.changePassword(this.uid,body).subscribe(
      (res) => {
        $('#close').click();
        alert('password changed')
      },(err) => {
        console.log(err);
      }
    )
  }
}
