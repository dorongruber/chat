import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ChatComponent } from './routes/chat/chat.component';
import { HeaderComponent } from './components/headers/header/header.component';
import { MessageComponent } from './components/message/message.component';
import { SharedModule } from '../shared/shared.module';
import { LandingpageComponent } from './routes/landingpage/landingpage.component';
import { MenuComponent } from './routes/menu/menu.component';
import { ChatsmenuComponent } from './components/chatsmenu/chatsmenu.component';
import { NewchatComponent } from './routes/newchat/newchat.component';
import { DeletechatComponent } from './components/deletechat/deletechat.component';
import { UserinfoComponent } from './routes/userinfo/userinfo.component';
import { ChatmenuitemComponent } from './components/chatsmenu/chatmenuitem/chatmenuitem.component';
import { DynamicheightDirective } from './directives/dynamicheight.directive';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { Header1Component } from './components/headers/header1/header1.component';
import { Header2Component } from './components/headers/header2/header2.component';
import { ComponentDirective } from './directives/component.directive';
import { SidenavselectorComponent } from './components/sidenavselector/sidenavselector.component';
import { GroupchatComponent } from './routes/groupchat/groupchat.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { DebounceKeyupDirective } from './directives/debounce-keyup.directive';
import { FormInputComponent } from './components/form-input/form-input.component';
import { SelectImageComponent } from './components/select-image/select-image.component';
import { ToggleReadonlyDirective } from './directives/toggle-readonly.directive';
import { ChatInfoComponent } from './routes/chat-info/chat-info.component';


@NgModule({
  declarations: [
    MainComponent,
    ChatComponent,
    HeaderComponent,
    MessageComponent,
    LandingpageComponent,
    MenuComponent,
    ChatsmenuComponent,
    NewchatComponent,
    DeletechatComponent,
    UserinfoComponent,
    ChatmenuitemComponent,
    DynamicheightDirective,
    Header1Component,
    Header2Component,
    ComponentDirective,
    SidenavselectorComponent,
    GroupchatComponent,
    ListItemComponent,
    SearchInputComponent,
    DebounceKeyupDirective,
    FormInputComponent,
    SelectImageComponent,
    ToggleReadonlyDirective,
    ChatInfoComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    MatSidenavModule,
    MatListModule
  ]
})
export class MainModule { }
