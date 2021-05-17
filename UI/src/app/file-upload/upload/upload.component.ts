import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ProgressStatus, ProgressStatusEnum } from 'src/app/models/progress-status';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.component.html'
})

export class UploadComponent {
  @Input() public disabled: boolean;
  @Output() public uploadStatus: EventEmitter<ProgressStatus>;
  @ViewChild('inputFile') inputFile: ElementRef;
  selectedFiles = []
  constructor(private service: UserService) {
    this.uploadStatus = new EventEmitter<ProgressStatus>();
  }

  public upload(event) {
    if (event.target.files.length === 0) {
      return;
    }
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = [];
      
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedFiles.push(event.target.files[i]);
      }

      // const file = event.target.files[0];
      this.uploadStatus.emit( {status: ProgressStatusEnum.START});
      this.service.uploadFile(this.selectedFiles).subscribe(
        data => {
          console.log(data);
          if (data) {
            switch (data.type) {
              case HttpEventType.UploadProgress:
                this.uploadStatus.emit( {status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100)});
                break;
              case HttpEventType.Response:
                this.inputFile.nativeElement.value = '';
                this.uploadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
                break;
            }
          }
        },
        error => {
          console.log(error);
          this.inputFile.nativeElement.value = '';
          this.uploadStatus.emit( {status: ProgressStatusEnum.ERROR});
        }
      );
    }
  }
}