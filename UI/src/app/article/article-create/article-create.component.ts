import { Component, OnInit } from '@angular/core';
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
  FileManagerService,
} from '@syncfusion/ej2-angular-richtexteditor';
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
    FileManagerService,
  ],
})
export class ArticleCreateComponent implements OnInit {
  title = 'article-create';
  userDetails: any;
  submitted = false;
  x: any = {};
  private toolbarSettings: Object = {
    items: ['Image'],
  };
  private iFrameSettings: Object = {
    enable: true,
  };
  private insertImageSettings: Object = {
    saveUrl: 'http://localhost:65241/api/Post/image',
    path: 'http://localhost:65241/Uploads/',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
    maxWidth: '400px',
    maxHeight: '400px',
    minWidth: '80px',
    minHeight: '80px',
  };

  constructor(
    private _router: Router,
    private service: UserService,
    private toast: ToastrService,
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
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['mode'] == 'edit') {
        this.editmode = true;

        this.article_id = params['id'];
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
          'FileManager',
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
        // maxWidth: '400px',
        // maxHeight: '400px',
        minWidth: '80px',
        minHeight: '80px',
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
      let visibility = '';
      $.each($("input[name='visibility']:checked"), function () {
        visibility += $(this).val();
      });

      let form = document.getElementById('form-element') as HTMLFormElement;
      let formData = new FormData(form);
      let rteValue = formData.get('defaultRTE');
      this.x['articleTitle'] = formData.get('title');
      this.x['articleDescription'] = rteValue;
      this.x['categoryId'] = $('#category').val();
      this.x['productId'] = $('#product').val();
      this.x['sectionId'] = $('#section').val();
      this.x['visible'] = visibility;

      if(id==1){
      this.x['status'] = false;
      this.x['draft'] = true;
      this.x['archive'] = false;
      }
      if(id==2){
      this.x['status'] = true;
      this.x['draft'] = true;
      this.x['archive'] = false;
      }

      this.x['commentAllow'] = this.commentonoff;
      this.x['id'] = this.userDetails.Id;
      console.log(this.x);
      this.service.postArticle(this.x).subscribe(
        (res) => {
          this.toast.success('Article Published', 'Success');
          console.log(res);
          // $('#title').text('');
          // $('#category').text('Choose Category');
          // $('#defaultRTE').text('');
        },
        (err) => {
          this.toast.error('Article Failed to Publish', 'Error');
          console.log(err);
        }
      );
    };

    //   let hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';

    //   let iframeRTE: RichTextEditor = new RichTextEditor({
    // height: 300,
    // iframeSettings: {
    //     enable: true
    // },
    // toolbarSettings: {
    //   items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
    //       'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
    //       'LowerCase', 'UpperCase', 'SuperScript', 'SubScript', '|',
    //       'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
    //       'Outdent', 'Indent', '|',
    //       'CreateTable', 'CreateLink', 'Image', 'FileManager', '|', 'ClearFormat', 'Print',
    //       'SourceCode', 'FullScreen', '|', 'Undo', 'Redo'
    //   ]
    // },
    // fileManagerSettings: {
    //     enable: true,
    //     path: '/Pictures/Food',
    //     ajaxSettings: {
    //         url: hostUrl + 'api/FileManager/FileOperations',
    //         getImageUrl: hostUrl + 'api/FileManager/GetImage',
    //         uploadUrl: hostUrl + 'api/FileManager/Upload',
    //         downloadUrl: hostUrl + 'api/FileManager/Download'
    //     }
    // },
    // actionBegin: handleFullScreen,
    // actionComplete: actionCompleteHandler
    //     });
    //   iframeRTE.appendTo('#iframeRTE');

    //   // let formObject = new FormValidator('#form-element');

    //   function handleFullScreen(e: any): void {
    //     let sbCntEle: HTMLElement = document.querySelector('.sb-content.e-view');
    //     let sbHdrEle: HTMLElement = document.querySelector('.sb-header.e-view');
    //     let leftBar: HTMLElement;
    //     let transformElement: HTMLElement;
    //     if (Browser.isDevice) {
    //         leftBar = document.querySelector('#right-sidebar');
    //         transformElement = document.querySelector('.sample-browser.e-view.e-content-animation');
    //     } else {
    //         leftBar = document.querySelector('#left-sidebar');
    //         transformElement = document.querySelector('#right-pane');
    //     }
    //     if (e.targetItem === 'Maximize') {
    //         if (Browser.isDevice && Browser.isIos) {
    //             addClass([sbCntEle, sbHdrEle], ['hide-header']);
    //         }
    //         addClass([leftBar], ['e-close']);
    //         removeClass([leftBar], ['e-open']);
    //         if (!Browser.isDevice) { transformElement.style.marginLeft = '0px'; }
    //         transformElement.style.transform = 'inherit';
    //     } else if (e.targetItem === 'Minimize') {
    //         if (Browser.isDevice && Browser.isIos) {
    //             removeClass([sbCntEle, sbHdrEle], ['hide-header']);
    //         }
    //         removeClass([leftBar], ['e-close']);
    //         if (!Browser.isDevice) {
    //         addClass([leftBar], ['e-open']);
    //         transformElement.style.marginLeft = leftBar.offsetWidth + 'px'; }
    //         transformElement.style.transform = 'translateX(0px)';
    //     }
    // }

    // function actionCompleteHandler(): void {
    //     setTimeout(() => { iframeRTE.toolbarModule.refreshToolbarOverflow(); }, 400);
    //   }
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

          console.log('Current Article Response :', this.currentarticle[0]);
          $('#title').val(this.currentarticle[0].Article_Title);
          $('#product').val(this.currentarticle[0].Product_Id).change();

          // this.fetchCategory();
          console.log('cat id ', this.currentarticle[0].Category_Id);

          console.log('visible', this.currentarticle[0].Visibility);

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
          } else {
            $('#signedinuser').prop('checked', true);
          }

          //  .val(this.currentarticle[0].Category_Id)
          //.trigger('change');
          //$('#section').val(this.currentarticle[0].Section_Id).change();

          //console.log(this.currentarticle[0].Description);
          document.getElementById(
            'defaultRTE'
          ).innerHTML = this.currentarticle[0].Description;
          this.defaultRTE.appendTo('#defaultRTE');
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  fetchCategory() {
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
        console.log('hello');
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
