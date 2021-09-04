import { animation } from '@angular/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { ChatComponent } from './routes/chats/chat/chat.component';
import { ChatsComponent } from './routes/chats/chats.component';

const routes: Routes = [
  {path: '', redirectTo: 'chats', pathMatch: 'full'},
  {path: '', component: MainComponent, children: [
    {path: 'chats', component: ChatsComponent ,data: {animation: 'Chats'} , children: [
      {path: ':id', component: ChatComponent, data: {animation: 'Chat'}}
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
