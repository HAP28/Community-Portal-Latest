import { Component, OnInit } from '@angular/core';
import { enableRipple } from '@syncfusion/ej2-base';
import * as $ from 'jquery';
enableRipple(true);

import { RichTextEditor, Toolbar, Link, Image, HtmlEditor, Count, QuickToolbar } from '@syncfusion/ej2-richtexteditor';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { UserService } from 'src/app/shared/user.service';
import { Router } from '@angular/router';
import { ToolbarService ,LinkService, ImageService, HtmlEditorService, QuickToolbarService , FileManagerService} from '@syncfusion/ej2-angular-richtexteditor';
RichTextEditor.Inject(Toolbar, Link, Image, HtmlEditor, Count, QuickToolbar);

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService, FileManagerService]
})

export class ArticleCreateComponent implements OnInit {
  title = 'article-create';
  userDetails: any;
  submitted = false;
  x : any = {};
  private toolbarSettings: Object = {
    items: ['Image']
  };
  private iFrameSettings : Object = {
    enable: true
  }
  private insertImageSettings: Object = {
      saveUrl: 'http://localhost:65241/api/Post/image',
      path: 'http://localhost:65241/Uploads/',
      removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
      maxWidth: '400px',
      maxHeight: '400px',
      minWidth: '80px',
      minHeight: '80px'
  };

  constructor(private _router : Router,private service:UserService) { }
  	  url: any;
	    msg = "";

    ngOnInit(): void {
      this.service.getUserProfile().subscribe(
        (res) => {
          this.userDetails = res;
        }, (err) => {
          console.log(err);
        }
      );

    let defaultRTE: RichTextEditor = new RichTextEditor({ showCharCount: true, placeholder: 'Type something', 
          height: 300,
          iframeSettings: {
              enable: true
          },
          toolbarSettings: {
            items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                'LowerCase', 'UpperCase', 'SuperScript', 'SubScript', '|',
                'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
                'Outdent', 'Indent', '|',
                'CreateTable', 'CreateLink', 'Image', 'FileManager', '|', 'ClearFormat', 'Print',
                'SourceCode', 'FullScreen', '|', 'Undo', 'Redo'
            ]
          },
          insertImageSettings: {
            saveUrl: 'http://localhost:65241/api/Post/image',
            path: 'http://localhost:65241/Uploads/',
            removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
            // maxWidth: '400px',
            // maxHeight: '400px',
            minWidth: '80px',
            minHeight: '80px'
          },
          fileManagerSettings: {
            enable: true,
            path: '/Pictures/Food',
            ajaxSettings: {
                url: 'http://localhost:65241/api/Post/image',
                uploadUrl: 'http://localhost:65241/api/Post/image'
            }
        }
});
    defaultRTE.appendTo('#defaultRTE');
    let formObject = new FormValidator('#form-element');

    $('#validateSubmit').click(() => {
      getValue();
    });

    const getValue = () =>{
      let form = document.getElementById('form-element') as HTMLFormElement;
      let formData = new FormData(form);
      let rteValue = formData.get('defaultRTE');
      
      this.x['Title'] = formData.get('title');      
      this.x['Text'] = rteValue
      this.x['CategoryId'] = 1;
      this.x['Id'] = "97d86dd2-7053-40f1-9df8-c20ad565681a";
      console.log(this.x);
      this.service.postArticle(this.x).subscribe((res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      });
    }


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

  		close(){
        alert('logged out');
        localStorage.removeItem('token');
        this._router.navigate(['/']);
  		}

      // onSubmit(form1) {
      //   this.submitted = true;
      //   console.log(form1.value);
      // }
}

