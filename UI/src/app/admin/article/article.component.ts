import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit {
  articles: any;
  user: any;
  data = false;
  dropdown = [{ name: 'Published', value: '0' }, { name: 'Not Published', value: '1' }];
  constructor(private service: UserService) {}

  ngOnInit(): void {
    if(localStorage.getItem('mode')){
      localStorage['mode'] = 'viewer';
    }else{
      localStorage.setItem('mode', 'viewer');
    }
    this.refreshList();
  }

  refreshList() {
    $('#dropdown').selectedIndex = 1;
    this.service.getPubishArticles().subscribe(
      (res) => {
        this.articles = res;
        this.articles.forEach((element) => {
          this.service.getUserById(element.User_Id).subscribe((res) => {
            this.user = res;
            element.user = this.user.FirstName + ' ' + this.user.LastName;
            this.data = true;
          });
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteArticle(aid) {
    this.service.deletearticlefullmaster(aid).subscribe((res) => {
      this.service.deletearticle(aid).subscribe(
        (res) => {
          console.log(res);
          this.refreshList();
        },
        (err) => {
          console.log(err);
        }
      );
    }),
      (err) => {
        console.log(err);
      };
  }

  fetchArticle(e){
    if(e.target.value == '1'){
      localStorage['mode'] = 'reviewer';
      this.service.getarticlesforreviewer().subscribe(
        (res) => {
          this.articles = res;
        },(err) => {
          console.log(err);
        }
      )
    } else{
      localStorage['mode'] = 'viewer';
      this.refreshList();
    }
  }
}
