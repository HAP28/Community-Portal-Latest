import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
declare var jQuery: any;
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent implements OnInit {
  isShow: boolean;
  countuser: any;
  countProducts: any;
  countarticles: any;
  topPosToStartShowing = 100;
  categoryList: any;
  constructor(private service: UserService, private router: Router) {}
  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    console.log('[scroll]', scrollPosition);

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
  // TODO: Cross browsing
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  ngOnInit(): void {
    this.refreshList();
    this.getAllCounts();
    (function ($) {
      // $(document).ready(function () {
      //   console.log('Counter Working!');
      //   $('.counter-count').each(function () {
      //     $(this)
      //       .prop('Counter', 0)
      //       .animate(
      //         {
      //           Counter: $(this).text(),
      //         },
      //         {
      //           duration: 7000,
      //           easing: 'swing',
      //           step: function (now) {
      //             $(this).text(Math.ceil(now));
      //           },
      //         }
      //       );
      //   });
      // });
      $('.card').hover(
        function () {
          $(this).addClass('shadow-lg').css('cursor', 'pointer');
        },
        function () {
          $(this).removeClass('shadow-lg');
        }
      );
    })(jQuery);
  }

  refreshList() {
    this.service.getCategory().subscribe(
      (res) => {
        console.log(res);
        this.categoryList = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getAllCounts() {
    this.service.getCountProducts().subscribe(
      (res) => {
        this.countProducts = res[0].Column1;
        console.log('Product count ', this.countProducts);
      },
      (err) => {
        console.log(err);
      }
    );
    this.service.getCountArticles().subscribe(
      (res) => {
        this.countarticles = res[0].Column1;
        console.log('Article count ', this.countarticles);
      },
      (err) => {
        console.log(err);
      }
    );
    this.service.countTotalUsers().subscribe(
      (res) => {
        this.countuser = res[0].Column1;
        console.log('Product count ', this.countuser);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  navigateArticles(url) {
    this.router.navigateByUrl(url);
  }
}
