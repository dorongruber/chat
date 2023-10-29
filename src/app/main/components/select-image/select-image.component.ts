import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
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
  @Input() type!: string;
  selectedFile: File | undefined = undefined;
  imgToShow: any = null;

  @Output() onImageFileChange: EventEmitter<File> = new EventEmitter<File>();
  constructor(
    private subscriptionContolService: SubscriptionContolService,
  ) {}

  ngOnChanges(): void {
    if(this.file && Object.keys(this.file).includes('data')) {
      this.imgToShow = (this.file as any).data;
    }
  }
  ProcessFile(imageInput: any) {
    const file: File = imageInput.target.files[0];
    if (file) {
      const reader = new FileReader();
      fromEvent(reader, 'load')
      .pipe(takeUntil(this.subscriptionContolService.stop$), tap((event: any) => {
        this.selectedFile = file ? file : new File([], 'emptyfile');
      }))
      .subscribe((event: any) => {
        this.imgToShow = event.target.result;
        this.onImageFileChange.emit(this.selectedFile);
      });
      reader.readAsDataURL(file);
    }
  }


}
