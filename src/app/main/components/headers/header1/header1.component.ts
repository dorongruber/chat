import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { ControllerService } from 'src/app/services/base/controller.service';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderMenuOption } from 'src/app/main/models/header-menu-option';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.scss']
})
export class Header1Component {
  @Input() menuOptions: HeaderMenuOption[] = [];
  @Input() extraOptions: HeaderMenuOption[] = [];
  @Input() title: string = '';
  @Input() type!: string;
  user!: User;
  asImage!: boolean;
  constructor(
    private router: Router,
    private userService: UserService,
    public controllerService: ControllerService,
    private sanitizer: DomSanitizer,
  ) { 
    this.userService.onUserChange.subscribe(res => {
      this.user = res;
    })
  }

  onOptionSelect(value: HeaderMenuOption) {
    if(!value.componentRef) {
      localStorage.removeItem('userData');
      this.router.navigate(['auth/login']);
    } else {
      this.controllerService.onStateChange(value);
    }
  }

  Transform(img: any) {
    const imgURL = img.data.data.includes('data:image/')? img.data.data : 'data:image/*;base64,' + img.data.data;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgURL);
  }

  back() {
    this.controllerService.onStateChange(undefined);
  }
}
