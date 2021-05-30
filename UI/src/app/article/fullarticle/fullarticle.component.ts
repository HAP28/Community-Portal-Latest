import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-fullarticle',
  templateUrl: './fullarticle.component.html',
  styleUrls: ['./fullarticle.component.css'],
})
export class FullarticleComponent implements OnInit {
  isShow: boolean;
  errormsg = false;
  unapprovemessage = '';
  topPosToStartShowing = 100;
  article_id: any;
  user_id: any;
  fullarticle: any;
  productName: any;
  categoryName: any;
  sectionName: any;
  comment = {};
  user: any;
  commentsList: any;
  cmtHeading = 'Comments..';
  loggedInUser = false;
  currentUser = false;
  admin = false;
  userName = '';
  total = 0;
  usefull = 0;
  articleFullMaster: any;
  articleMasterByuser: any;
  articleMasterPost = {};
  data = false;
  likeVisibility = true;
  page: any;
  Status: boolean;
  Draft: boolean;
  Archive = false;
  reviewer = false;
  display = false;
  displayUpload = false;
  folderfound = false;
  articlepostedbyuser: any;
  constructor(
    private service: UserService,
    private activateroute: ActivatedRoute,
    private router: Router
  ) {}
  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // console.log('[scroll]', scrollPosition);

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
    localStorage.removeItem('folder');
    this.activateroute.queryParams.subscribe((params) => {
      this.Status = JSON.parse(params['s']);
      this.Draft = JSON.parse(params['d']);
      this.Archive = JSON.parse(params['a']);
      console.log('Clicked Article: ', this.Draft, this.Status, this.Archive);
    });
    this.validateadminreviewer();
    this.getFullArticle();
    this.refreshComments();
    this.refreshList();
    if (this.service.currentUser == null) {
      this.loggedInUser = true;
      $('#cmtbtn').prop('disabled', true);
    } else {
      this.service.getUserProfile().subscribe(
        (res) => {
          this.currentUser = true;
          this.user = res;
          console.log(this.user.Id);
          this.user_id = this.user.Id;
          this.service
            .getarticleusefullmasterbyarticleanduser(
              this.article_id,
              this.user.Id
            )
            .subscribe((res) => {
              console.log(res);
              this.articleMasterByuser = res;
              if (this.articleMasterByuser.length != 0) {
                if (this.articleMasterByuser[0].likes) {
                  $('#like').addClass('text-primary');
                }
                if (this.articleMasterByuser[0].dislikes) {
                  $('#dislike').addClass('text-danger');
                }
              }
            });
        },
        (err) => {
          console.log(err);
        }
      );
      if (this.service.currentUser.Role == 'Admin') {
        this.admin = true;
      } else if (this.service.currentUser.Role == 'Reviewer') {
        this.reviewer = true;
      }
    }
  }
  validateadminreviewer() {
    if (this.service.currentUser != null) {
      if (
        (this.service.currentUser.Role == 'Admin' ||
          this.service.currentUser.Role == 'Reviewer') &&
        localStorage.getItem('mode') == 'reviewer'
      ) {
        this.likeVisibility = false;
        $('#approve').css('visibility', 'visible');
        $('#unpublish').css('display', 'none');
      }
      if (this.service.currentUser.Role != 'Admin') {
        $('#unpublish').css('display', 'none');
      }
    } else {
      $('#approve').css('display', 'none');
      $('#unpublish').css('display', 'none');
    }
  }
  getFullArticle() {
    this.activateroute.queryParams.subscribe((params) => {
      this.article_id = params['articleid'];
      console.log('Clicked Article: ', this.article_id);
    });
    this.service.getArticleById(this.article_id).subscribe(
      (res) => {
        this.data = true;
        this.fullarticle = res;
        this.articlepostedbyuser = this.fullarticle[0].User_Id;
        console.log('Full article ', this.fullarticle[0].User_Id);
        if (
          this.fullarticle[0].FolderName != '' &&
          this.fullarticle[0].FolderName != null
        ) {
          this.folderfound = true;
          localStorage.setItem('folder', this.fullarticle[0].FolderName);
        } else {
          this.folderfound = false;
          localStorage.removeItem('folder');
        }
        console.log('article response by id : ', this.fullarticle[0]);
        if (!this.fullarticle[0].CommentAllow) {
          $('#cmtbtn').prop('disabled', true);
          $('#openclosecomment').css('visibility', 'visible');
        }
        if (
          this.fullarticle[0].CommentAllow &&
          this.service.currentUser != null
        ) {
          $('#cmtbtn').prop('disabled', false);
        }

        this.getProductName();
        this.getCategoryName();
        this.getSectionName();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  refreshList() {
    this.service
      .getarticleusefullmasterbyarticleanduser(this.article_id, this.user_id)
      .subscribe((res) => {
        console.log(res);
        this.articleMasterByuser = res;
        if (this.articleMasterByuser.length != 0) {
          if (this.articleMasterByuser[0].likes) {
            $('#like').addClass('text-primary');
          }
          if (this.articleMasterByuser[0].dislikes) {
            $('#dislike').addClass('text-danger');
          }
        }
      });
    this.service
      .getarticlefullmasterbyarticle(this.article_id)
      .subscribe((res) => {
        console.log(res);
        this.articleFullMaster = res;
        this.usefull = 0;
        this.total = 0;
        this.articleFullMaster.forEach((element) => {
          if (element.likes) {
            this.usefull += 1;
            this.total += 1;
          } else if (element.dislikes) {
            this.total += 1;
          }
        });
      });
  }
  getProductName() {
    this.service.getProductsById(this.fullarticle[0].Product_Id).subscribe(
      (res) => {
        var response = res;
        this.productName = response[0]['Product_Name'];
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getCategoryName() {
    this.service.getCategoryById(this.fullarticle[0].Category_Id).subscribe(
      (res) => {
        var response = res;
        this.categoryName = response[0]['Category_Name'];
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getSectionName() {
    this.service.getSectionById(this.fullarticle[0].Section_Id).subscribe(
      (res) => {
        var response = res;
        this.sectionName = response[0]['Section_Name'];
      },
      (err) => {
        console.log(err);
      }
    );
  }
  postComment() {
    if ($('#comment').val() != '') {
      this.comment['Comment_text'] = $('#comment').val();
      this.comment['id'] = this.user.Id;
      this.comment['ArticleId'] = this.article_id;
      console.log(this.comment);
      this.service.postComment(this.comment).subscribe(
        (res) => {
          console.log(res);
          this.refreshComments();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  refreshComments() {
    $('#comment').val('');
    this.service.getCommentsByArticleId(this.article_id).subscribe(
      (res) => {
        this.commentsList = res;
        if (this.commentsList.length == 0) {
          this.cmtHeading = 'Be the first to comment';
        } else {
          this.cmtHeading = 'Comments..';
          this.commentsList.forEach((element) => {
            this.service.getUserById(element.User_Id).subscribe(
              (res) => {
                var response = res;
                element['user'] =
                  response['FirstName'] + ' ' + response['LastName'];
              },
              (err) => {
                console.log(err);
              }
            );
          });
        }

        console.log(this.commentsList);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteComment(id) {
    // alert(id);
    this.service.deleteComments(id).subscribe(
      (res) => {
        console.log(res);
        this.refreshComments();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  like() {
    if (this.articleMasterByuser.length == 0) {
      this.articleMasterPost['article_id'] = this.article_id;
      this.articleMasterPost['user_id'] = this.user.Id;
      this.articleMasterPost['likes'] = true;
      this.articleMasterPost['dislikes'] = false;

      this.service.postarticleusefullmaster(this.articleMasterPost).subscribe(
        (res) => {
          console.log(res);
          this.refreshList();
          $('#like').toggleClass('text-primary');
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      if ($('#like').hasClass('text-primary')) {
        this.articleMasterPost['article_id'] = this.article_id;
        this.articleMasterPost['user_id'] = this.user.Id;
        this.articleMasterPost['likes'] = false;
        this.articleMasterPost['dislikes'] = false;
        this.service.putarticleusefullmaster(this.articleMasterPost).subscribe(
          (res) => {
            console.log(res);
            this.refreshList();
            $('#like').removeClass('text-primary');
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.articleMasterPost['article_id'] = this.article_id;
        this.articleMasterPost['user_id'] = this.user.Id;
        this.articleMasterPost['likes'] = true;
        this.articleMasterPost['dislikes'] = false;
        this.service.putarticleusefullmaster(this.articleMasterPost).subscribe(
          (res) => {
            console.log(res);
            this.refreshList();
            $('#like').addClass('text-primary');
            $('#dislike').removeClass('text-danger');
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }
  }
  dislike() {
    if (this.articleMasterByuser.length == 0) {
      this.articleMasterPost['article_id'] = this.article_id;
      this.articleMasterPost['user_id'] = this.user.Id;
      this.articleMasterPost['likes'] = false;
      this.articleMasterPost['dislikes'] = true;

      this.service.postarticleusefullmaster(this.articleMasterPost).subscribe(
        (res) => {
          console.log(res);
          this.refreshList();
          $('#dislike').toggleClass('text-danger');
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      if ($('#dislike').hasClass('text-danger')) {
        this.articleMasterPost['article_id'] = this.article_id;
        this.articleMasterPost['user_id'] = this.user.Id;
        this.articleMasterPost['likes'] = false;
        this.articleMasterPost['dislikes'] = false;
        this.service.putarticleusefullmaster(this.articleMasterPost).subscribe(
          (res) => {
            console.log(res);
            this.refreshList();
            $('#dislike').removeClass('text-danger');
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.articleMasterPost['article_id'] = this.article_id;
        this.articleMasterPost['user_id'] = this.user.Id;
        this.articleMasterPost['likes'] = false;
        this.articleMasterPost['dislikes'] = true;
        this.service.putarticleusefullmaster(this.articleMasterPost).subscribe(
          (res) => {
            console.log(res);
            this.refreshList();
            $('#dislike').addClass('text-danger');
            $('#like').removeClass('text-primary');
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }
  }
  approvearticle() {
    console.log('Approve');
    this.service.patch_approve_article(this.article_id).subscribe(
      (res) => {
        console.log(res);
        this.service.setreviewer(this.user_id, this.article_id).subscribe(
          (res) => {
            console.log(res);
            this.router.navigateByUrl('/article-posts');
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }
  disapprovearticle() {
    console.log('DisApprove');
    if ($('#message').val() != '') {
      this.errormsg = false;
      let message = $('#message').val();
      this.service.disapprovemsg(this.article_id, message).subscribe(
        (res) => {
          console.log(res);
          $('#closemodal').click();
          this.router.navigateByUrl('/article-posts?message=disapprove');
        },
        (err) => {
          console.log(err);
        }
      );
      console.log(message);
    } else {
      this.errormsg = true;
    }
  }
  unpublisharticle() {
    this.service.unpublish_article(this.article_id).subscribe(
      (res) => {
        console.log(res);
        this.router.navigateByUrl('/article-posts');
      },
      (err) => {
        console.log(err);
      }
    );
  }
  editarticle() {
    this.router.navigateByUrl(
      '/article-create?mode=edit&id=' +
        this.article_id +
        '&uid=' +
        this.articlepostedbyuser
    );
  }
  navigate() {
    this.activateroute.queryParams.subscribe((params) => {
      this.page = params['page'];
      if (this.page == 'dashboard') {
        this.router.navigateByUrl('/managearticles');
      } else if (this.page == 'profile') {
        this.router.navigateByUrl('/profile');
      } else {
        this.router.navigateByUrl('/article-posts');
      }
    });
  }
  deletearticle() {
    this.service.deleteCommentByArticle(this.article_id).subscribe(
      (res) => {
        console.log(res)
        this.service.deletearticlefullmaster(this.article_id).subscribe(
          (res) => {
            console.log(res);
            this.service.deletearticle(this.article_id).subscribe(
              (res) => {
                console.log(res);
                this.navigate();
              },
              (err) => {
                console.log(err);
              }
            );
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
    
  }
  login() {
    this.router.navigate(['/login']);
  }
}
