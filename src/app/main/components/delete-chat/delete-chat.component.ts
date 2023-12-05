import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeUntil, tap } from "rxjs/operators";
import { ChatService } from 'src/app/services/chat.service';
import { ChatsService } from 'src/app/services/chats.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { Chat } from '../../models/chat';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { Header2Component } from '../headers/header2/header2.component';

@Component({
  selector: 'app-deletechat',
  templateUrl: './delete-chat.component.html',
  styleUrls: ['./delete-chat.component.scss']
})
export class DeletechatComponent implements OnInit {
  fid: string | undefined;
  sid: string | undefined;
  chats: Chat[] = [];
  filterOptions: Observable<Chat[]> = of([]);
  deleteForm: FormGroup = new FormGroup({});
  chatToDelete: Chat = new Chat('','','', new File([],'emptyFile'));
  resMsg = '';
  componentRef = new DynamicComponentRef(Header2Component);
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private chatsService: ChatsService,
    private subscriptionContolService: SubscriptionContolService,
    ) {
      this.initForm();
      this.userService.onUserChange
      .pipe(
        takeUntil(this.subscriptionContolService.stop$), tap((user: User) => {
          this.fid = user._id;
          this.sid = user.id;
          this.initChats();
        }))
        .subscribe(
          () => {},
          (err) => {
            console.log("errer delete chat"); 
          },
        );
    }

  ngOnInit(): void {
    this.deleteForm.controls['chatName'].valueChanges
    .pipe(takeUntil(this.subscriptionContolService.stop$))
    .subscribe(value => {
      this.filterOptions = of(this._filter(value))
    });
  }

  initForm() {
    this.deleteForm = new FormGroup({
      chatName: new FormControl('', Validators.required),
    });
  }

  async initChats() {
    this.chats = await this.chatsService.getChats(this.sid!);
    this.filterOptions = of([...this.chats]);
  }

  private _filter(value: string): Chat[] {
    const filterValue = value.toLocaleLowerCase();

    return this.chats.filter(option => option.name.toLocaleLowerCase().includes(filterValue));
  }

  selectOption(chat: Chat) {
    this.chatToDelete = chat;
  }

  async onSubmit(form: FormGroup) {
    if(!form.valid) return;
    if( form.value.chatName === this.chatToDelete.name && this.fid)
      this.resMsg = await this.chatService.deleteChat(this.chatToDelete._id,this.fid)
      .then(res => {
        if(res) return 'chat add been deleted sussesfully';
        return 'failed to delete chat';
      })
      .catch(err => {
        throw new Error(err);
      });
  }

}
