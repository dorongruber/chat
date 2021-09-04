import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { ChatsComponent } from './routes/chats/chats.component';
import { ChatComponent } from './routes/chats/chat/chat.component';
import { HeaderComponent } from './components/header/header.component';
import { MessageComponent } from './components/message/message.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MainComponent,
    ChatsComponent,
    ChatComponent,
    HeaderComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }
