import { animation } from '@angular/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGurd } from '../auth/models/auth-gurd';

import { MainComponent } from './main.component';
import { ChatComponent } from './routes/chat/chat.component';

import { LandingpageComponent } from './routes/landingpage/landingpage.component';
import { NewchatComponent } from './routes/newchat/newchat.component';

const routes: Routes = [
  {path: '', redirectTo: 'landingpage', pathMatch: 'full'},
  {path: '', component: MainComponent, canActivate: [AuthGurd] ,children: [
    {path: 'landingpage', component: LandingpageComponent},
    {path: 'newchat', component: NewchatComponent, data: {animation: 'Chat'}},
    {path: 'newchat/:id', component: NewchatComponent, data: {animation: 'Chat'}},
    {path: 'chat/:id', component: ChatComponent, data: {animation: 'Chat'}},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
