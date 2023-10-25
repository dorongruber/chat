import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
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
export class SelectImageComponent implements OnChanges{
  @Input() form!: FormGroup;
  @Input() file: File | undefined;
  selectedFile: ImageSnippet | undefined = undefined;
  imgToShow: any = null;

  @Output() onImageFileChange: EventEmitter<ImageSnippet> = new EventEmitter<ImageSnippet>();
  constructor(
    private sanitizer: DomSanitizer,
    private subscriptionContolService: SubscriptionContolService,
  ) {}

  ngOnChanges(): void {
    if(this.file && Object.keys(this.file).includes('data')) {
      this.imgToShow = (this.file as any).data;
      this.selectedFile = new ImageSnippet(
        new File([(this.file as any).data],
       (this.file as any).filename)
      );
    }
  }
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
        this.onImageFileChange.emit(this.selectedFile);
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
