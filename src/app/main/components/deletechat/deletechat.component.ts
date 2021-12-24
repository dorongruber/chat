import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ControllerService } from 'src/app/services/base/controller.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { Chat } from '../../models/chat';

@Component({
  selector: 'app-deletechat',
  templateUrl: './deletechat.component.html',
  styleUrls: ['./deletechat.component.scss']
})
export class DeletechatComponent implements OnInit, OnChanges {
  @Input() userId: string | undefined;
  chats: Chat[] = [];
  filterOptions: Observable<Chat[]> = of([]);
  deleteForm: FormGroup = new FormGroup({});
  chatToDelete: Chat = new Chat('','');
  resMsg = '';
  user: User;
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private controllerService: ControllerService,
    ) {
      this.user = this.userService.get();
     }
  ngOnInit() {
    this.deleteForm.controls['chatName'].valueChanges.subscribe(value => {
      this.filterOptions = of(this._filter(value))
    });
  }

  ngOnChanges(): void {
    if(this.userId) {
      this.initChats();
      this.initForm();
    }
  }

  initForm() {
    this.deleteForm = new FormGroup({
      chatName: new FormControl('', Validators.required),
    });
  }

  async initChats() {
    if(this.userId)
      this.chats = await this.userService.getChats(this.userId);
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
    if( form.value.chatName === this.chatToDelete.name && this.userId)
      this.resMsg = await this.chatService.deleteChat(this.chatToDelete.id,this.userId)
      .then(res => {
        if(res) return 'chat add been deleted sussesfully';
        return 'failed to delete chat';
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  closeWindow() {
    this.controllerService.onStateChange(undefined);
  }

}
