import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import * as safeHtml from './pipe';

@Component({
  selector: 'app-article-posts',
  templateUrl: './article-posts.component.html',
  styleUrls: ['./article-posts.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ArticlePostsComponent implements OnInit {
  display = false;
  Articles: any;
  searching: any;
  product: any;
  category: any;
  section: any;
  result: any;
  response: any;
  FullName: any;
  isDataAvailable: boolean = false;
  searchText = '';
  constructor(
    private service: UserService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.refreshList();
    this.validateAdminReviewer();
    this.getpublicArticles();
    localStorage.setItem('mode', 'viewer');
  }
  formatdate(articles) {
    for (var i = 0; i < articles.length; i++) {
      var date = new Date(articles[i].PostedOn);
      articles[i].PostedOn = date.toDateString();
    }
  }
  validateAdminReviewer() {
    if (this.service.currentUser != null) {
      if (
        this.service.currentUser.Role == 'Admin' ||
        this.service.currentUser.Role == 'Reviewer'
      ) {
        $('.feku').css('visibility', 'visible');
      }
    }
  }
  toogleswitch() {
    this.refreshList();
    console.log('status', $('#toggle-one').prop('checked'));
    if ($('#toggle-one').prop('checked')) {
      this.toast.success('You are switch to review mode', 'Reviewer Mode', {
        positionClass: 'toast-bottom-right',
      });
      localStorage['mode'] = 'reviewer';

      // $('toggle-one')
      this.service.getarticlesforreviewer().subscribe(
        (res) => {
          console.log(res);
          //this.getreviewarticles();
          this.Articles = res;
          this.formatdate(this.Articles);
          this.commoncode(this.Articles);
          console.log('Review articles', this.Articles);
        },
        (err) => {
          console.log(err);
        }
      );
    }
    if (!$('#toggle-one').prop('checked')) {
      this.toast.success('You are switch to Viewer mode', 'Viewer Mode', {
        positionClass: 'toast-bottom-right',
      });
      localStorage['mode'] = 'viewer';
      this.getpublicArticles();
    }
  }

  // readMore(article_id) {
  //   this.router.navigateByUrl(
  //     '/article?page=article-posts&articleid=' + article_id
  //   );

  readMore(article_id, s, d, a) {
    this.router.navigateByUrl(
      '/article?page=article-posts&articleid=' +
        article_id +
        '&s=' +
        s +
        '&d=' +
        d +
        '&a=' +
        a
    );
  }
  fetchCategory() {
    var product = $('#productList').val();
    if (product != '') {
      this.service.getCategoryByProducts(product).subscribe(
        (res) => {
          this.category = res;
          //clear the list
          $('#categoryList')
            .find('option')
            .remove()
            .end()
            .append('<option value="">Choose Category</option>')
            .val('');
          $('#sectionList')
            .find('option')
            .remove()
            .end()
            .append('<option value="">Choose Section</option>')
            .val('');

          for (var i = 0; i < this.category.length; i++) {
            //creates option tag
            console.log(this.category[i]);
            $('<option/>')
              .val(this.category[i].Category_Id)
              .html(this.category[i].Category_Name)
              .appendTo('#categoryList');
          }
          $('#categoryList').prop('disabled', false);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  fetchSection() {
    var category = $('#categoryList').val();
    if (category != '') {
      this.service.getSectionByCategory(category).subscribe(
        (res) => {
          this.section = res;
          //clear the list
          $('#sectionList')
            .find('option')
            .remove()
            .end()
            .append('<option value="">Choose Section</option>')
            .val('');

          for (var i = 0; i < this.section.length; i++) {
            //creates option tag
            console.log(this.section[i]);
            $('<option/>')
              .val(this.section[i].Section_Id)
              .html(this.section[i].Section_Name)
              .appendTo('#sectionList');
          }
          $('#sectionList').prop('disabled', false);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  commoncode(articles: any) {
    this.Articles = articles;
    this.formatdate(this.Articles);
    this.Articles.forEach((element) => {
      this.service.getUserById(element.User_Id).subscribe(
        (res) => {
          var response = res;
          element.user = response['FirstName'] + ' ' + response['LastName'];
        },
        (err) => {
          console.log(err);
        }
      );
      this.service.getUserById(element.Reviewer_Id).subscribe(
        (res) => {
          var response = res;
          element.reviewer = response['FirstName'] + ' ' + response['LastName'];
        },
        (err) => {
          console.log(err);
        }
      );
      this.service.getProductsById(element.Product_Id).subscribe(
        (res) => {
          var responseP = res;
          element.product = responseP[0]['Product_Name'];
        },
        (err) => {
          console.log(err);
        }
      );
      this.service.getCategoryById(element.Category_Id).subscribe(
        (res) => {
          var response = res;
          element.category = response[0]['Category_Name'];
        },
        (err) => {
          console.log(err);
        }
      );
      this.service.getSectionById(element.Section_Id).subscribe(
        (res) => {
          var response = res;
          element.section = response[0]['Section_Name'];
        },
        (err) => {
          console.log(err);
        }
      );
    });
    this.isDataAvailable = true;
  }
  getpublicArticles() {
    if (this.service.currentUser == null) {
      this.service.getPubishArticles().subscribe(
        (res) => {
          this.Articles = res;
          console.log(res);
          this.formatdate(this.Articles);
          this.commoncode(this.Articles);
          console.log('public articles', this.Articles);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.service.getLoggedinArticles().subscribe(
        (res) => {
          this.Articles = res;
          console.log(res);
          this.formatdate(this.Articles);
          this.commoncode(this.Articles);
          console.log('public articles', this.Articles);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  refreshList() {
    $('#categoryList').prop('disabled', true);
    $('#sectionList').prop('disabled', true);
    this.service.getProducts().subscribe(
      (res) => {
        this.product = res;
        $('#productList')
          .find('option')
          .remove()
          .end()
          .append('<option value="">Choose Product</option>')
          .val('');
        $('#sectionList')
          .find('option')
          .remove()
          .end()
          .append('<option value="">Choose Section</option>')
          .val('');
        $('#categoryList')
          .find('option')
          .remove()
          .end()
          .append('<option value="">Choose Category</option>')
          .val('');
        for (var i = 0; i < this.product.length; i++) {
          //creates option tag
          console.log(this.product[i]);
          $('<option/>')
            .val(this.product[i].Product_Id)
            .html(this.product[i].Product_Name)
            .appendTo('#productList');
        }
      },
      (err) => {
        console.log(err);
      }
    );
    // this.getpublicArticles();
  }

  searchArticle() {
    let visibility = '1';
    let draft;
    let archive = false;
    if (localStorage.getItem('mode') == 'viewer') {
      draft = false;
    } else {
      draft = true;
    }
    var product = $('#productList').val();
    var category = $('#categoryList').val();
    var section = $('#sectionList').val();
    if (product == '') {
      alert('Select Product');
      this.refreshList();
      return;
    } else {
      if (category == '') {
        this.service
          .getArticleByProduct(product, draft, archive, visibility)
          .subscribe(
            (res) => {
              this.Articles = res;
              this.formatdate(this.Articles);
              this.Articles.forEach((element) => {
                this.service.getUserById(element.User_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.user =
                      response['FirstName'] + ' ' + response['LastName'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getUserById(element.Reviewer_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.reviewer =
                      response['FirstName'] + ' ' + response['LastName'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getProductsById(element.Product_Id).subscribe(
                  (res) => {
                    var responseP = res;
                    element.product = responseP[0]['Product_Name'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getCategoryById(element.Category_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.category = response[0]['Category_Name'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getSectionById(element.Section_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.section = response[0]['Section_Name'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              });

              this.isDataAvailable = true;

              console.log(this.Articles);
            },
            (err) => {
              console.log(err);
            }
          );
      } else if (section == '') {
        this.service
          .getArticleByProductAndCategory(
            product,
            category,
            draft,
            archive,
            visibility
          )
          .subscribe(
            (res) => {
              this.Articles = res;
              this.formatdate(this.Articles);
              console.log(this.Articles);
              this.Articles.forEach((element) => {
                this.service.getUserById(element.User_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.user =
                      response['FirstName'] + ' ' + response['LastName'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getUserById(element.Reviewer_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.reviewer =
                      response['FirstName'] + ' ' + response['LastName'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getProductsById(element.Product_Id).subscribe(
                  (res) => {
                    var responseP = res;
                    element.product = responseP[0]['Product_Name'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getCategoryById(element.Category_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.category = response[0]['Category_Name'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getSectionById(element.Section_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.section = response[0]['Section_Name'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              });
              this.isDataAvailable = true;
            },
            (err) => {
              console.log(err);
            }
          );
      } else {
        this.service
          .getArticleByProductAndCategoryAndSection(
            product,
            category,
            section,
            draft,
            archive,
            visibility
          )
          .subscribe(
            (res) => {
              this.Articles = res;
              this.formatdate(this.Articles);
              console.log(this.Articles);
              this.Articles.forEach((element) => {
                this.service.getUserById(element.User_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.user =
                      response['FirstName'] + ' ' + response['LastName'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getUserById(element.Reviewer_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.reviewer =
                      response['FirstName'] + ' ' + response['LastName'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getProductsById(element.Product_Id).subscribe(
                  (res) => {
                    var responseP = res;
                    element.product = responseP[0]['Product_Name'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getCategoryById(element.Category_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.category = response[0]['Category_Name'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                this.service.getSectionById(element.Section_Id).subscribe(
                  (res) => {
                    var response = res;
                    element.section = response[0]['Section_Name'];
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              });
              this.isDataAvailable = true;
            },
            (err) => {
              console.log(err);
            }
          );
      }
    }
  }
}
