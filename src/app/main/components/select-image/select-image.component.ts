import { Component, Input } from '@angular/core';
import { ImageSnippet } from '../../models/imagesnippet.model';
import { takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss']
})
export class SelectImageComponent {
  @Input() form!: FormGroup;
  selectedFile: ImageSnippet | undefined = undefined;
  imgToShow: any = null;

  constructor(
    private sanitizer: DomSanitizer,
    private subscriptionContolService: SubscriptionContolService,
  ) {}
  ProcessFile(imageInput: any) {
    const file: File = imageInput.target.files[0];
    if (file) {
      const reader = new FileReader();
      fromEvent(reader, 'load')
      .pipe(takeUntil(this.subscriptionContolService.stop$), tap((event: any) => {
        if (file) {
          const newfile = new File([file], file.name);
          this.selectedFile = new ImageSnippet(newfile);
        } else {
          const emptyFile = new File([], 'emptyfile');
          this.selectedFile = new ImageSnippet(emptyFile);
        }
      }))
      .subscribe((event: any) => {
        this.imgToShow = event.target.result;
      });
      reader.readAsDataURL(file);
    }
  }

  Transform() {
    if( this.imgToShow) {
      const imgURL = this.imgToShow.includes('data:image/')? this.imgToShow : 'data:image/*;base64,' + this.imgToShow;
      return this.sanitizer.bypassSecurityTrustResourceUrl(imgURL);
    }      
    return '';
  }
}
