import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery'
@Component({
  selector: 'app-fullarticle',
  templateUrl: './fullarticle.component.html',
  styleUrls: ['./fullarticle.component.css'],
})
export class FullarticleComponent implements OnInit {
  isShow: boolean;
  topPosToStartShowing = 100;
  article_id: any;
  fullarticle: any;
  productName: any;
  categoryName: any;
  sectionName: any;
  comment = {};
  user : any;
  commentsList : any;
  cmtHeading = "Comments..";
  loggedInUser = false;
  currentUser = false;
  admin = false;
  userName = ''

  constructor(
    private service: UserService,
    private activateroute: ActivatedRoute
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
    this.getFullArticle();
    this.refreshComments();
    if(this.service.currentUser == null){
      this.loggedInUser = true;
      $("#cmtbtn").prop('disabled',true);
    }else{
      this.currentUser = true;
      this.service.getUserProfile().subscribe(
        (res) => {
          this.user = res;
        }
      )
      if(this.service.currentUser.Role == "Admin"){
        this.admin = true;
      }
    }
  }
  getFullArticle() {
    this.activateroute.queryParams.subscribe((params) => {
      this.article_id = params['articleid'];
      console.log('Clicked Article: ', this.article_id);
    });
    this.service.getArticleById(this.article_id).subscribe(
      (res) => {
        this.fullarticle = res;
        console.log('article response by id : ', this.fullarticle[0]);
        this.getProductName();
        this.getCategoryName();
        this.getSectionName();
      },
      (err) => {
        console.log(err);
      }
    );
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
  postComment(){
    if($('#comment').val() != ""){      
      this.comment['Comment_text'] = $('#comment').val();
      this.comment['id'] = this.user.Id;
      this.comment['ArticleId'] = this.article_id;
      console.log(this.comment);
      this.service.postComment(this.comment).subscribe(
        (res) => {
          console.log(res);
          this.refreshComments();
        },(err) => {
          console.log(err);
        }
      )
    }
    
  }

  refreshComments(){
    $('#comment').val("");
    this.service.getCommentsByArticleId(this.article_id).subscribe(
      (res) => {
        this.commentsList = res;
        if(this.commentsList.length == 0){
          this.cmtHeading = "Be the first to comment";
        }else{
          this.cmtHeading = "Comments.."
          this.commentsList.forEach(element => {
            this.service.getUserById(element.User_Id).subscribe(
              (res) => {
                var response = res;
                element['user'] = response['FirstName'] + ' ' + response['LastName'];
                
              },(err) => {
                console.log(err);
              }
            )
          });
        }
        
        console.log(this.commentsList);
        
      },(err) => {
        console.log(err);
      }
    )
  }

  deleteComment(id){
    // alert(id);
    this.service.deleteComments(id).subscribe(
      (res) =>{
        console.log(res);
        this.refreshComments();
      },(err) => {
        console.log(err);
      }
    )
  }
}
