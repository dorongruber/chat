import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnChanges {
  @Input() option: number = 0;
  selectedMenuOption: number = 0;
  constructor() { }

  ngOnChanges(): void {
     setTimeout(() => {
       this.selectedMenuOption = this.option;
     },1000)
  }

}
