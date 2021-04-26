import { Component, OnInit ,ViewEncapsulation  } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-article-posts',
  templateUrl: './article-posts.component.html',
  styleUrls: ['./article-posts.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ArticlePostsComponent implements OnInit {

  Articles: any;
  constructor(private service: UserService) { }

  ngOnInit(): void {
    document.getElementById('header-frame').style.display = 'none';
    this.refreshList();
  }

  refreshList(){
    this.service.getAllArticles().subscribe(
      (res) => {
        this.Articles = res;
      }, (err) => {
        console.log(err);
      }
    )
  }
}
