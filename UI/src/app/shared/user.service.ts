import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaderResponse,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { ConfirmedValidator } from '../custom-validators';
import { Observable } from 'rxjs';
import { CustomEncoder } from './CustomEncoder';

interface ForgotPasswordDto {
  email: string;
  clientURI: string;
}
interface ResetPasswordDto {
  password: string;
  confirmPassword: string;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  readonly APIURL = 'http://localhost:65241/api';
  // readonly ClientURL = 'http://localhost:4200';

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
  updateuserprofile(uid, model) {
    return this.http.patch(
      this.APIURL + '/Account/updateprofile/' + uid,
      model
    );
  }

  getUserProfile() {
    // console.log(this.APIURL + '/UserProfile');

    return this.http.get(this.APIURL + '/UserProfile');
  }
  //get Roles
  getRoles() {
    return this.http.get(this.APIURL + '/Roles');
  }
  getRoleName(roleid) {
    return this.http.get(this.APIURL + '/Roles/getrolename/' + roleid);
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
  countTotalUsers() {
    return this.http.get(this.APIURL + '/Users/count');
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
  getArticleByProduct(pid, draft, archive, visibility) {
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/articleByProduct?pid=' +
        pid +
        '&draft=' +
        draft +
        '&archive=' +
        archive +
        '&visibility=' +
        visibility
    );
  }
  getArticleByProductAndCategory(pid, cid, draft, archive, visibility) {
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/articleByProductAndCategory?pid=' +
        pid +
        '&cid=' +
        cid +
        '&draft=' +
        draft +
        '&archive=' +
        archive +
        '&visibility=' +
        visibility
    );
  }
  getArticleByProductAndCategoryAndSection(
    pid,
    cid,
    sid,
    draft,
    archive,
    visibility
  ) {
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/articleByProductCategorySection?pid=' +
        pid +
        '&cid=' +
        cid +
        '&sid=' +
        sid +
        '&draft=' +
        draft +
        '&archive=' +
        archive +
        '&visibility=' +
        visibility
    );
  }
  //Articles
  getPubishArticles() {
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/articlegetvisibility/1/' +
        true +
        '/' +
        false +
        '/' +
        false
    );
  }
  getLoggedinArticles() {
    //public + loggedin
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/userarticleforloggdin/' +
        true +
        '/' +
        false +
        '/' +
        false
    );
  }
  postArticle(article: any) {
    return this.http.post(this.APIURL + '/ArticleMaster', article);
  }
  updateArticle(article: any, aid) {
    return this.http.put(this.APIURL + '/ArticleMaster/' + aid, article);
  }
  getarticleforuser(uid) {
    return this.http.get(this.APIURL + '/ArticleMaster/user/' + uid);
  }
  getdraftarticleforuser(uid) {
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/articlegetforuser/' +
        uid +
        '/' +
        false +
        '/' +
        true +
        '/' +
        false
    );
  }
  getarchivearticleforuser(uid) {
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/articlegetforuser/' +
        uid +
        '/' +
        false +
        '/' +
        false +
        '/' +
        true
    );
  }
  getpublisharticleforuser(uid) {
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/articlegetforuser/' +
        uid +
        '/' +
        true +
        '/' +
        false +
        '/' +
        false
    );
  }

  getarticlesforreviewer() {
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/articleget/' +
        true +
        '/' +
        true +
        '/' +
        false
    );
  }
  patch_approve_article(id) {
    return this.http.patch(
      this.APIURL +
        '/ArticleMaster/articlepatch/' +
        id +
        '/' +
        true +
        '/' +
        false +
        '/' +
        false,
      null
    );
  }
  setreviewer(rid, aid) {
    return this.http.patch(
      this.APIURL + '/ArticleMaster/reviewer?rid=' + rid + '&aid=' + aid,
      null
    );
  }
  patch_disapprove_article(id) {
    return this.http.patch(
      this.APIURL +
        '/ArticleMaster/articlepatch/' +
        id +
        '/' +
        false +
        '/' +
        false +
        '/' +
        true,
      null
    );
  }
  disapprovemsg(id, msg) {
    return this.http.patch(
      this.APIURL +
        '/ArticleMaster/articlepatchmessage/' +
        id +
        '/' +
        false +
        '/' +
        false +
        '/' +
        true +
        '/' +
        msg,
      null
    );
  }
  unpublish_article(id) {
    return this.http.patch(
      this.APIURL +
        '/ArticleMaster/articlepatch/' +
        id +
        '/' +
        true +
        '/' +
        true +
        '/' +
        false,
      null
    );
  }

  // Count
  getCountArticles() {
    return this.http.get(this.APIURL + '/ArticleMaster/getarticlecounts');
  }
  getUserArticlesCount(uid: string) {
    return this.http.get(
      this.APIURL + '/ArticleMaster/usertotalarticle/' + uid
    );
  }
  getUserArticlesCountForAll(uid, s, d, a) {
    return this.http.get(
      this.APIURL +
        '/ArticleMaster/userarticlecount/' +
        uid +
        '/' +
        s +
        '/' +
        d +
        '/' +
        a
    );
  }
  deletearticle(id) {
    return this.http.delete(this.APIURL + '/ArticleMaster/' + id);
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
  getCountProducts() {
    return this.http.get(this.APIURL + '/ProductMaster/productcount');
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
  countCategory() {
    return this.http.get(this.APIURL + '/CategoryMaster/count');
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
  countSection() {
    return this.http.get(this.APIURL + '/SectionMaster/count');
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

  //likes dislikes
  getarticleusefullmaster() {
    return this.http.get(this.APIURL + '/ArticleUseFullMaster');
  }
  getarticlefullmasterbyarticle(aid) {
    return this.http.get(this.APIURL + '/ArticleUseFullMaster/' + aid);
  }
  getarticleusefullmasterbyarticleanduser(aid, uid) {
    return this.http.get(
      this.APIURL + '/ArticleUseFullMaster/' + aid + '/' + uid
    );
  }

  postarticleusefullmaster(model) {
    return this.http.post(this.APIURL + '/ArticleUseFullMaster/', model);
  }
  putarticleusefullmaster(model) {
    return this.http.put(this.APIURL + '/ArticleUseFullMaster/', model);
  }
  deletearticlefullmaster(aid) {
    return this.http.delete(this.APIURL + '/ArticleUseFullMaster/' + aid);
  }

  public uploadFile(file, folder) {
    const formData: FormData = new FormData();
    file.forEach((f) => formData.append('formFiles', f));
    // formData.append('formFiles', file);

    console.log(formData);
    const req = new HttpRequest(
      'POST',
      `${this.APIURL}/ArticleMaster/Upload?subDirectory=${folder}`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  public getFiles(folder): Observable<string[]> {
    return this.http.get<string[]>(
      this.APIURL + '/ArticleMaster/files?folder=' + folder
    );
  }

  public downloadFile(
    folder: string,
    file: string
  ): Observable<HttpEvent<Blob>> {
    return this.http.request(
      new HttpRequest(
        'GET',
        `${this.APIURL}/ArticleMaster/Download?folder=${folder}&fileUrl=${file}`,
        null,
        {
          reportProgress: true,
          responseType: 'blob',
        }
      )
    );
  }

  public deleteFilesFromArticle(folder: string, filename: string) {
    return this.http.delete(
      this.APIURL +
        '/ArticleMaster/deletefile?folder=' +
        folder +
        '&filename=' +
        filename
    );
  }

  //password
  public forgotPassword = (body: ForgotPasswordDto) => {
    return this.http.post(this.APIURL + '/Account/ForgotPassword', body);
  };
  public resetPassword = (body: ResetPasswordDto) => {
    return this.http.post(this.APIURL + '/Account/ResetPassword', body);
  };
  public changePassword = (id, body) => {
    return this.http.post(
      this.APIURL + '/Account/ChangePassword?id=' + id,
      body
    );
  };
  // Contact Form
  contactus(model) {
    return this.http.post(this.APIURL + '/Account/contact', model);
  }

  // Email
  public confirmEmail = (token: string, email: string) => {
    let params = new HttpParams({ encoder: new CustomEncoder() });
    params = params.append('token', token);
    params = params.append('email', email);
    return this.http.get(this.APIURL + '/Account/EmailConfirmation', {
      params: params,
    });
  };
}
