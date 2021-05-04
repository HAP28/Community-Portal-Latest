import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaderResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ConfirmedValidator } from '../custom-validators';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  readonly APIURL = 'http://localhost:65241/api';
  formModel = this.fb.group(
    {
      FirstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[_A-z]*((-|s)*[_A-z])*$'),
        ],
      ],

      LastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[_A-z]*((-|s)*[_A-z])*$'),
        ],
      ],

      // UserName: ['',[Validators.required,  Validators.minLength(2), Validators.pattern('^[_A-z0-9]*((-|\s)*[_A-z0-9])*$')]],

      Email: ['', [Validators.required, Validators.email]],

      Password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
          ),
        ],
      ],

      confirmpassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
          ),
        ],
      ],
    },
    {
      validator: ConfirmedValidator('Password', 'confirmpassword'),
    }
  );
  get f() {
    return this.formModel.controls;
  }

  register() {
    var body = {
      // UserName : this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      Password: this.formModel.value.Password,
      FirstName: this.formModel.value.FirstName,
      LastName: this.formModel.value.LastName,
    };
    console.log(body);
    return this.http.post(this.APIURL + '/Account/Register', body, {
      responseType: 'text',
    });
  }

  public get currentUser(): any {
    if (localStorage.getItem('loggedUser') != undefined) {
      return JSON.parse(localStorage.getItem('loggedUser'));
    } else return null;
  }

  login(formData) {
    return this.http.post<any>(this.APIURL + '/Account/Login', formData, {
      observe: 'response',
    });
  }

  getUserProfile() {
    // console.log(this.APIURL + '/UserProfile');

    return this.http.get(this.APIURL + '/UserProfile');
  }
  //get Roles
  getRoles() {
    return this.http.get(this.APIURL + '/Roles');
  }
  addRoles(roleName) {
    return this.http.post(this.APIURL + '/Roles/' + roleName, null);
  }
  deleteRoles(roleid) {
    return this.http.delete(this.APIURL + '/Roles/' + roleid);
  }
  //admin
  //get every User details
  getAllUsers() {
    return this.http.get(this.APIURL + '/Users');
  }
  //getUser by user id
  getUserById(uid) {
    return this.http.get(this.APIURL + '/Users/user/' + uid);
  }
  //delete User by Id
  deleteUserById(uid) {
    return this.http.delete(this.APIURL + '/Users/userdelete/' + uid);
  }
  //get user roles
  getUserRoles(userId) {
    return this.http.get(this.APIURL + '/UserRoles/' + userId);
  }
  putUserRoles(id, model) {
    return this.http.put(this.APIURL + '/UserRoles/' + id, model);
  }
  //get Permission By Roles
  getPermissionByRoles(roleId) {
    return this.http.get(this.APIURL + '/Permission/' + roleId);
  }
  //put permission by role id
  putPermissionByRoles(model) {
    return this.http.put(this.APIURL + '/Permission', model);
  }

  getAllArticles() {
    return this.http.get(this.APIURL + '/ArticleMaster');
  }
  getArticleById(articleid) {
    return this.http.get(this.APIURL + '/ArticleMaster/article/' + articleid);
  }
  // filter article
  getArticleByProduct(pid) {
    return this.http.get(this.APIURL + '/ArticleMaster/product/' + pid);
  }
  getArticleByProductAndCategory(pid, cid) {
    return this.http.get(
      this.APIURL + '/ArticleMaster/product/' + pid + '/category/' + cid
    );
  }
  getArticleByProductAndCategoryAndSection(pid, cid, sid) {
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/product/' +
        pid +
        '/category/' +
        cid +
        '/section/' +
        sid
    );
  }
  getPublicArticles() {
    return this.http.get(this.APIURL + '/ArticleMaster/public');
  }
  postArticle(article: any) {
    return this.http.post(this.APIURL + '/ArticleMaster', article);
  }

  //get products
  getProducts() {
    return this.http.get(this.APIURL + '/ProductMaster');
  }
  getProductsById(id) {
    return this.http.get(this.APIURL + '/ProductMaster/product/' + id);
  }
  postProduct(product: any) {
    return this.http.post(this.APIURL + '/ProductMaster', product);
  }
  updateProduct(product: any) {
    return this.http.put(this.APIURL + '/ProductMaster', product);
  }
  deleteProductbyid(productid) {
    return this.http.delete(this.APIURL + '/ProductMaster/' + productid);
  }

  //get Categories
  getCategory() {
    return this.http.get(this.APIURL + '/CategoryMaster');
  }
  getCategoryById(id) {
    return this.http.get(this.APIURL + '/CategoryMaster/Category/' + id);
  }
  getCategoriesByUid(Uid) {
    return this.http.get(this.APIURL + '/CategoryMaster/user/' + Uid);
  }
  getCategoryByProducts(Pid) {
    return this.http.get(this.APIURL + '/CategoryMaster/product/' + Pid);
  }
  postCategory(category: any) {
    return this.http.post(this.APIURL + '/CategoryMaster', category);
  }
  deleteCategorybyid(catid) {
    return this.http.delete(this.APIURL + '/CategoryMaster/' + catid);
  }
  updateCategory(category: any) {
    return this.http.put(this.APIURL + '/CategoryMaster', category);
  }

  //get Sections
  getSection() {
    return this.http.get(this.APIURL + '/SectionMaster');
  }
  getSectionById(id) {
    return this.http.get(this.APIURL + '/SectionMaster/section/' + id);
  }
  getSectionByUid(Uid) {
    return this.http.get(this.APIURL + '/SectionMaster/user/' + Uid);
  }
  getSectionByCategory(Cid) {
    return this.http.get(this.APIURL + '/SectionMaster/category/' + Cid);
  }
  postSection(section: any) {
    return this.http.post(this.APIURL + '/SectionMaster', section);
  }
  deleteSectionbyid(sectionid) {
    return this.http.delete(this.APIURL + '/SectionMaster/' + sectionid);
  }
  updateSection(section: any) {
    return this.http.put(this.APIURL + '/SectionMaster', section);
  }
  //comment
  getCommentsByArticleId(Aid) {
    return this.http.get(this.APIURL + '/Comment/article/' + Aid);
  }
  postComment(model) {
    return this.http.post(this.APIURL + '/Comment', model);
  }
  deleteComments(id) {
    return this.http.delete(this.APIURL + '/Comment/' + id);
  }
}
