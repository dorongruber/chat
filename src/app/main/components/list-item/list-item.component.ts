import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { ListItem } from '../../models/list-item';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnChanges {
  @Input() listItem: ListItem = new ListItem('','','',{});
  @Output() onSelectedItem: EventEmitter<ListItem> = new EventEmitter<ListItem>();
  asImage!: boolean;
  constructor(
    private sanitizer: DomSanitizer,
  ) { 

  }

  ngOnChanges(): void {
    this.asImage = this.checkImage(this.listItem.img);
  }

  onItemSelect(listItem: ListItem) {
    this.onSelectedItem.emit(listItem);
  }

  checkImage(img?: File): boolean {
    console.log(img);
    
    return img && (img as any).data?.data;
  }

  Transform(img: any) {
    const imgURL = img.data.data.includes('data:image/')? img.data.data : 'data:image/*;base64,' + img.data.data;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgURL);
  }
}
