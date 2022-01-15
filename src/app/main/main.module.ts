import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './routes/chat/chat.component';
import { HeaderComponent } from './components/header/header.component';
import { MessageComponent } from './components/message/message.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { LandingpageComponent } from './routes/landingpage/landingpage.component';
import { MenuComponent } from './components/menu/menu.component';
import { ChatsmenuComponent } from './components/chatsmenu/chatsmenu.component';
import { NewchatComponent } from './routes/newchat/newchat.component';
import { DeletechatComponent } from './components/deletechat/deletechat.component';
import { UserinfoComponent } from './components/userinfo/userinfo.component';
import { ChatmenuitemComponent } from './components/chatsmenu/chatmenuitem/chatmenuitem.component';



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
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }
