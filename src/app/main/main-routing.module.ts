import { animation } from '@angular/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGurd } from '../auth/models/auth-gurd';

import { MainComponent } from './main.component';
import { ChatComponent } from './routes/chat/chat.component';

import { LandingpageComponent } from './routes/landingpage/landingpage.component';
import { NewchatComponent } from './routes/newchat/newchat.component';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  {path: '', redirectTo: 'landingpage', pathMatch: 'full'},
  {path: '', component: MainComponent, canActivate: [AuthGurd] ,children: [
    {path: 'landingpage', component: LandingpageComponent},
    {path: 'new', component: NewchatComponent, data: {animation: 'Chat'}},
    {path: 'chatinfo', component: NewchatComponent, data: {animation: 'Chat'}},
    {path: 'chat/:id', component: ChatComponent, data: {animation: 'Chat'}},
    {path: 'menu', component: MenuComponent, data: {animation: 'Chat'}},
  ]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
