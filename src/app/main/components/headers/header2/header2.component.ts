import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderMenuOption } from 'src/app/main/models/header-menu-option';
import { ControllerService } from 'src/app/services/base/controller.service';

@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.scss']
})
export class Header2Component {
  @Input() menuOptions: HeaderMenuOption[] = [];
  @Input() title: string = '';
  @Input() type!: string;
  constructor(public controllerService: ControllerService) { }

  onOptionSelect(index: number) {
    
    switch(index) {
      case 0:
        this.controllerService.onStateChange(this.menuOptions[index]);
        break;
      case 1:
        this.back();
        break;
      default:
        this.controllerService.onStateChange(undefined);
        break;
    }
  }

  back() {
    this.controllerService.onStateChange(undefined);
  }
}
