import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { enableRipple } from '@syncfusion/ej2-base';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

enableRipple(true);

import {
  RichTextEditor,
  Toolbar,
  Link,
  Image,
  HtmlEditor,
  Count,
  QuickToolbar,
} from '@syncfusion/ej2-richtexteditor';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { UserService } from 'src/app/shared/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  QuickToolbarService,
} from '@syncfusion/ej2-angular-richtexteditor';
import {
  RichTextEditorComponent,
  NodeSelection,
} from '@syncfusion/ej2-angular-richtexteditor';

import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import {
  ProgressStatus,
  ProgressStatusEnum,
} from 'src/app/models/progress-status';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
RichTextEditor.Inject(Toolbar, Link, Image, HtmlEditor, Count, QuickToolbar);

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css'],
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService,
    NodeSelection,
  ],
})
export class ArticleCreateComponent implements OnInit {
  showModal: boolean;
  articleCreate: FormGroup;
  title = 'article-create';
  userDetails: any;
  submitted = false;
  x: any = {};

  constructor(
    private _router: Router,
    private service: UserService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}
  url: any;
  msg = '';
  product: any;
  category: any;
  section: any;
  commentonoff: any;
  article_id: any;
  editmode: boolean = false;
  currentarticle: any;
  defaultRTE: RichTextEditor;
  folderName: string;
  RandomFolderName: string;
  loadUpload = true;
  userid: any;
  ngOnInit(): void {
    this.articleCreate = this.formBuilder.group({
      title: ['', [Validators.required]],
      product: ['', [Validators.required]],
      category: ['', [Validators.required]],
      section: ['', [Validators.required]],
      // editor: ['', [Validators.required]],
    });

    localStorage.removeItem('folder');
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['mode'] == 'edit') {
        this.editmode = true;

        // $('#validateSubmit').css('display', 'none');

        this.loadUpload = false;
        // $('#validateSubmit').css('display','none');
        this.article_id = params['id'];
        this.userid = params['uid'];
        console.log('Clicked Article: ', this.article_id);
      }
    });

    this.refreshList();

    $('#header-frame').css('display', 'none');
    this.service.getUserProfile().subscribe(
      (res) => {
        this.userDetails = res;
      },
      (err) => {
        console.log(err);
      }
    );

    this.defaultRTE = new RichTextEditor({
      showCharCount: true,
      placeholder: 'Type something',
      height: 300,
      iframeSettings: {
        enable: true,
      },
      toolbarSettings: {
        items: [
          'Bold',
          'Italic',
          'Underline',
          'StrikeThrough',
          'FontName',
          'FontSize',
          'FontColor',
          'BackgroundColor',
          'LowerCase',
          'UpperCase',
          'SuperScript',
          'SubScript',
          '|',
          'Formats',
          'Alignments',
          'OrderedList',
          'UnorderedList',
          'Outdent',
          'Indent',
          '|',
          'CreateTable',
          'CreateLink',
          'Image',
          '|',
          'ClearFormat',
          'Print',
          'SourceCode',
          'FullScreen',
          '|',
          'Undo',
          'Redo',
        ],
      },
      insertImageSettings: {
        saveUrl: 'http://localhost:65241/api/ArticleMaster/image',
        path: 'http://localhost:65241/Uploads/',
        removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
        // minWidth: '80px',
        // minHeight: '80px',
      },
      fileManagerSettings: {
        enable: true,
        path: '/Pictures/Food',
        ajaxSettings: {
          url: 'http://localhost:65241/api/ArticleMaster/image',
          uploadUrl: 'http://localhost:65241/api/ArticleMaster/image',
        },
      },
    });
    this.defaultRTE.appendTo('#defaultRTE');
    let formObject = new FormValidator('#form-element');

    $('#validateSubmit').click(() => {
      getValue(1);
    });

    $('#publishforreview').click(() => {
      getValue(2);
    });

    const getValue = (id) => {
      let form = document.getElementById('form-element') as HTMLFormElement;
      let formData = new FormData(form);
      let rteValue = formData.get('defaultRTE');
      this.submitted = true;
      if (this.articleCreate.invalid) {
        console.log('form invalid');
        return;
      }
      console.log(rteValue);
      if (this.submitted) {
        this.showModal = false;

        let visibility = '';
        $.each($("input[name='visibility']:checked"), function () {
          visibility += $(this).val();
        });

        this.x['articleTitle'] = formData.get('title');
        this.x['articleDescription'] = rteValue;
        this.x['categoryId'] = $('#category').val();
        this.x['productId'] = $('#product').val();
        this.x['sectionId'] = $('#section').val();
        this.x['visible'] = visibility;
        if (localStorage.getItem('folder')) {
          this.x['FolderName'] = localStorage.getItem('folder');
        }

        if (id == 1) {
          this.x['status'] = false;
          this.x['draft'] = true;
          this.x['archive'] = false;
        }
        if (id == 2) {
          this.x['status'] = true;
          this.x['draft'] = true;
          this.x['archive'] = false;
        }

        this.x['commentAllow'] = this.commentonoff;
        this.x['id'] = this.userDetails.Id;
        // console.log(this.x);

        if (this.editmode) {
          this.x['id'] = this.userid;
          console.log('article to update :', this.x);
          this.service.updateArticle(this.x, this.article_id).subscribe(
            (res) => {
              this.toast.success('Article Updated', 'Success');
              this._router.navigateByUrl(
                'article?page=article-posts&articleid=' +
                  this.article_id +
                  '&s=' +
                  this.x['status'] +
                  '&d=' +
                  this.x['draft'] +
                  '&a=' +
                  this.x['archive']
              );
              console.log(res);
            },
            (err) => {
              this.toast.error('Article Update failed', 'Error');
              console.log(err);
            }
          );
        }
        if (!this.editmode) {
          console.log(this.editmode);
          this.service.postArticle(this.x).subscribe(
            (res) => {
              if (id == 1) {
                this.toast.success('Article saved to draft', 'Success');
                this._router.navigateByUrl('/profile');
              } else {
                this.toast.success(
                  'Article Published \n Wait for reviewer to review your article',
                  'Success'
                );
                this._router.navigateByUrl('/home');
              }
              console.log(res);
            },
            (err) => {
              this.toast.error('Article Failed to Publish', 'Error');
              console.log(err);
            }
          );
        }
      }
    };
  }
  get f() {
    return this.articleCreate.controls;
  }

  clearProductList() {
    $('#product')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Choose Product</option>')
      .val('');
  }
  clearCategoryList() {
    $('#category')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Choose Category</option>')
      .val('');
  }
  clearSectionList() {
    $('#section')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Choose Section</option>')
      .val('');
  }

  refreshList() {
    //disable dropdown
    $('#category').prop('disabled', true);
    $('#section').prop('disabled', true);
    // fetch all products

    this.service.getProducts().subscribe((res) => {
      this.clearProductList();
      this.clearCategoryList();
      this.clearSectionList();
      this.product = res;
      for (var i = 0; i < this.product.length; i++) {
        //creates option tag
        console.log(this.product[i]);
        $('<option/>')
          .val(this.product[i].Product_Id)
          .html(this.product[i].Product_Name)
          .appendTo('#product');
      }
    });

    if (this.editmode) {
      // $('#category').prop('disabled', false);
      this.service.getArticleById(this.article_id).subscribe(
        (res) => {
          this.currentarticle = res;
          localStorage.setItem('folder', this.currentarticle[0].FolderName);
          this.folderName = localStorage.getItem('folder');
          this.loadUpload = true;
          console.log('Current Article Response :', this.currentarticle[0]);
          // $('#title').val(this.currentarticle[0].Article_Title);
          this.articleCreate.controls['title'].setValue(
            this.currentarticle[0].Article_Title
          );
          this.articleCreate.controls['product'].setValue(
            this.currentarticle[0].Product_Id
          );
          this.fetchCategory();

          if (this.currentarticle[0].CommentAllow == true) {
            $('#togglecomment').prop('checked', true);
          } else {
            $('#togglecomment').prop('checked', false);
          }

          if (this.currentarticle[0].Visibility == '1') {
            $('#public').prop('checked', true);
            $('#applicationuser').prop('checked', false);
            $('#signedinuser').prop('checked', false);
            $('#applicationuser').attr('disabled', true);
            $('#signedinuser').attr('disabled', true);
          } else if (this.currentarticle[0].Visibility == '2') {
            $('#applicationuser').prop('checked', true);
          } else if (this.currentarticle[0].Visibility == '23') {
            $('#applicationuser').prop('checked', true);
            $('#signedinuser').prop('checked', true);
          } else {
            $('#signedinuser').prop('checked', true);
          }
          document.getElementById('defaultRTE').innerHTML =
            this.currentarticle[0].Description;
          this.defaultRTE.appendTo('#defaultRTE');
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  fetchCategory() {
    //console.log(this.currentarticle[0]);
    this.clearCategoryList();
    this.clearSectionList();
    var productSelected = $('#product').val();
    console.log(productSelected);
    this.service.getCategoryByProducts(productSelected).subscribe(
      (res) => {
        $('#category').prop('disabled', false);
        this.category = res;
        for (var i = 0; i < this.category.length; i++) {
          //creates option tag
          console.log(this.category[i]);
          $('<option/>')
            .val(this.category[i].Category_Id)
            .html(this.category[i].Category_Name)
            .appendTo('#category');
        }
        if (this.editmode) {
          this.articleCreate.controls['category'].setValue(
            this.currentarticle[0].Category_Id
          );
          this.fetchSection();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  fetchSection() {
    this.clearSectionList();

    var categorySelected = $('#category').val();
    this.service.getSectionByCategory(categorySelected).subscribe(
      (res) => {
        this.section = res;
        for (var i = 0; i < this.section.length; i++) {
          //creates option tag
          console.log(this.section[i]);
          $('<option/>')
            .val(this.section[i].Section_Id)
            .html(this.section[i].Section_Name)
            .appendTo('#section');
        }
        $('#section').prop('disabled', false);
        if (this.editmode) {
          this.articleCreate.controls['section'].setValue(
            this.currentarticle[0].Section_Id
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkBoxValidation() {
    if ($('#public').prop('checked')) {
      $('#applicationuser').prop('checked', false);
      $('#signedinuser').prop('checked', false);
      $('#applicationuser').attr('disabled', true);
      $('#signedinuser').attr('disabled', true);
    } else {
      $('#applicationuser').attr('disabled', false);
      $('#signedinuser').attr('disabled', false);
    }
  }

  close() {
    alert('logged out');
    localStorage.removeItem('token');
    this._router.navigate(['/']);
  }

  commentallow() {
    if ($('#togglecomment').prop('checked')) {
      this.commentonoff = true;
    }
    if (!$('#togglecomment').prop('checked')) {
      this.commentonoff = false;
    }
  }
}
