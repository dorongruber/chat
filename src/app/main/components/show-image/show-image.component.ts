import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.scss']
})
export class ShowImageComponent implements OnChanges {

  @Input() imgToShow: string | undefined;
  @Input() type!: string;
  iconName!: string;

  constructor(
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
      this.iconName = this.type == 'group' ? 'supervised_user_circle' : 'account_circle';
  }

  Transform() {
    const imgURL = this.imgToShow?.includes('data:image/')? this.imgToShow : 'data:image/*;base64,' + this.imgToShow;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgURL);
  }
}
