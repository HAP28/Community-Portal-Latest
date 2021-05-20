import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ProgressStatusEnum,
  ProgressStatus,
} from 'src/app/models/progress-status';
import { UserService } from 'src/app/shared/user.service';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-filemanager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css'],
})
export class FileManagerComponent implements OnInit {
  @Input() display: boolean;
  public files: string[];
  public fileInDownload: string;
  public percentage: number;
  public showProgress: boolean;
  public showDownloadError: boolean;
  public showUploadError: boolean;
  constructor(private service: UserService) {}

  ngOnInit() {
    if (localStorage.getItem('folder')) {
      this.getFiles(localStorage.getItem('folder'));
    }
  }

  private getFiles(folder) {
    this.service.getFiles(folder).subscribe((data) => {
      this.files = data;
      console.log();
    });
  }

  public downloadStatus(event: ProgressStatus) {
    switch (event.status) {
      case ProgressStatusEnum.START:
        this.showDownloadError = false;
        break;
      case ProgressStatusEnum.IN_PROGRESS:
        this.showProgress = true;
        this.percentage = event.percentage;
        break;
      case ProgressStatusEnum.COMPLETE:
        this.showProgress = false;
        break;
      case ProgressStatusEnum.ERROR:
        this.showProgress = false;
        this.showDownloadError = true;
        break;
    }
  }

  public uploadStatus(event: ProgressStatus) {
    switch (event.status) {
      case ProgressStatusEnum.START:
        this.showUploadError = false;
        break;
      case ProgressStatusEnum.IN_PROGRESS:
        this.showProgress = true;
        this.percentage = event.percentage;
        break;
      case ProgressStatusEnum.COMPLETE:
        this.showProgress = false;
        this.getFiles(localStorage.getItem('folder'));
        break;
      case ProgressStatusEnum.ERROR:
        this.showProgress = false;
        this.showUploadError = true;
        break;
    }
  }
  deleteFile(file) {
    console.log(file);
    this.service
      .deleteFilesFromArticle(localStorage.getItem('folder'), file)
      .subscribe(
        (res) => {
          this.getFiles(localStorage.getItem('folder'));
        },
        (err) => {
          if (err.status == 200) {
            this.getFiles(localStorage.getItem('folder'));
          } else {
            console.log(err);
          }
        }
      );
  }
}
