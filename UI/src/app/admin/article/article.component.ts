import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit {
  status: boolean = false;
  showme = '';
  articles: any;
  user: any;
  data = false;
  abc: any;
  dropdown = [
    { name: 'Published', value: '0' },
    { name: 'Not Published', value: '1' },
    { name: 'All Articles', value: '2' },
  ];
  searchText = '';
  characters = [];
  constructor(private service: UserService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('mode')) {
      localStorage['mode'] = 'viewer';
    } else {
      localStorage.setItem('mode', 'viewer');
    }
    this.refreshList();
  }

  formatdate(articles) {
    for (var i = 0; i < articles.length; i++) {
      var date = new Date(articles[i].PostedOn);
      articles[i].PostedOn = date.toDateString();
    }
  }
  refreshList() {
    $('#dropdown').selectedIndex = 1;
    this.status = false;
    this.service.getPubishArticles().subscribe(
      (res) => {
        this.articles = res;
        this.formatdate(this.articles);
        this.articles.forEach((element) => {
          this.characters.push({
            id: element.Article_Id,
            name: element.Article_Title,
          });
        });
        this.articles.forEach((element) => {
          this.service.getUserById(element.User_Id).subscribe((res) => {
            this.user = res;
            console.log(this.user);
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

  fetchArticle(e) {
    if (e.target.value == '1') {
      this.status = false;
      localStorage['mode'] = 'reviewer';
      this.service.getarticlesforreviewer().subscribe(
        (res) => {
          this.articles = res;
          this.formatdate(this.articles);
          this.characters = [];
          this.articles.forEach((element) => {
            this.characters.push({
              id: element.Article_Id,
              name: element.Article_Title,
            });
          });
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
    } else if (e.target.value == '2') {
      let s, d, a;
      console.log('all articles');
      this.service.getAllArticles().subscribe(
        (res) => {
          this.articles = res;

          this.formatdate(this.articles);

          this.characters = [];

          this.articles.forEach((element) => {
            s = element.Status;
            d = element.Draft;
            a = element.Archive;

            if (!s && d && !a) {
              console.log(s, d, a);
              element['abc'] = 'Draft';
            } else if (s && !d && !a) {
              element['abc'] = 'Publish';
            } else if (s && d && !a) {
              element['abc'] = 'Review';
            } else if (!s && !d && a) {
              element['abc'] = 'Archive';
            } else {
              element['abc'] = 'No Status';
            }
            this.service.getUserById(element.User_Id).subscribe((res) => {
              this.user = res;
              element.user = this.user.FirstName + ' ' + this.user.LastName;
              this.data = true;
            });
          });
          console.log(this.articles);
          this.status = true;
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      localStorage['mode'] = 'viewer';
      this.refreshList();
    }
  }
  readMore(article_id, s, d, a) {
    this.router.navigateByUrl(
      '/article?page=dashboard&articleid=' +
        article_id +
        '&s=' +
        s +
        '&d=' +
        d +
        '&a=' +
        a
    );
  }
}
