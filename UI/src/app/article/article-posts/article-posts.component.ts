import { Component, OnInit ,ViewEncapsulation  } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-article-posts',
  templateUrl: './article-posts.component.html',
  styleUrls: ['./article-posts.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ArticlePostsComponent implements OnInit {

  butDisabled = "disabled";
  Articles: any;
  searching: any;
  product: any;
  category: any;
  section: any;
  result: any;
  response: any;
  FullName: any;
  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.refreshList();
    // $('#categoryList').prop('disabled',true);
    // $('#sectionList').prop('disabled',true);    
    
    document.getElementById('header-frame').style.display = 'none';
  }

  fetchCategory(){
    var product = $('#productList').val();
    if(product != ""){
      this.service.getCategoryByProducts(product).subscribe(
        (res)=> {
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
          $('#categoryList').prop('disabled',false);
        },(err) => {
          console.log(err);
        }
      )
    }  
  }

  fetchSection(){
    var category = $('#categoryList').val();
    if(category != ""){
      this.service.getSectionByCategory(category).subscribe(
        (res)=> {
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
          $('#sectionList').prop('disabled',false);
        },(err) => {
          console.log(err);
        }
      )
    }  
  }

  refreshList(){
    $('#categoryList').prop('disabled',true);
    $('#sectionList').prop('disabled',true);    
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

    this.service.getAllArticles().subscribe(
      (res) => {
        this.Articles = res;
        console.log(this.Articles)
        for(var i=0;i<this.Articles.length;i++){
          this.FullName = this.userFullName(this.Articles[i].User_Id);
          console.log(this.FullName);
          this.Articles[i].user = localStorage.getItem(this.Articles[i].User_Id);
        }
      }, (err) => {
        console.log(err);
      }
    )
  }

  searchArticle(){
    var product = $('#productList').val();
    var category = $('#categoryList').val();
    var section = $('#sectionList').val();
    if(product == ''){

      alert('Select Product');
      this.refreshList();
      return;
    } else{
      if(category == ''){
        this.service.getArticleByProduct(product).subscribe(
          (res) => {
            this.Articles = res;
            this.Articles['user'] = this.userFullName(this.Articles.User_Id);
            console.log(res);
          },(err) => {
            console.log(err);
          }
        )
      } else if(section == ''){
        this.service.getArticleByProductAndCategory(product,category).subscribe(
          (res) => {
            this.Articles = res;
            this.Articles['user'] = this.userFullName(this.Articles.User_Id);
            console.log(res);
          },(err) => {
            console.log(err);
          }
        )
      } else{
        this.service.getArticleByProductAndCategoryAndSection(product,category,section).subscribe(
          (res) => {
            this.Articles = res;
            this.Articles['user'] = this.userFullName(this.Articles.User_Id);
            console.log(res);
          },(err) => {
            console.log(err);
          }
        )
      }
    }
  }
  userFullName(uid){
    // var response;
    console.log(uid);
    this.service.getUserById(uid).subscribe(
      (res) => {
        console.log(res);
        
        this.response = res;
        console.log(this.response.FirstName + " " + this.response.LastName);
        this.result = this.response['FirstName'] + " " + this.response['LastName'];
        localStorage.setItem(uid,this.result);
        return this.result;
      },(err) => {
        this.result = "error"
        console.log(err);
        return this.result;
      }
    )
  }
}
