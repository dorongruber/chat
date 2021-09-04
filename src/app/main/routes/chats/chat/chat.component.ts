import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { observable, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  message: string = '';
  messages: string[] = [];
  chatId$: Observable<string>;
  chatId: string = '';
  constructor(private route: ActivatedRoute) {
    this.chatId$ = new Observable<string>();
   }

  ngOnInit(): void {
   this.chatId$ = this.route.paramMap.pipe(switchMap(params => {
     return params.getAll('id');
   }))

   this.chatId$.subscribe(res => {
     this.chatId = res;
   })
  }

  onMessageSubmit(form: NgForm) {
    if (form.invalid) return;
    this.messages.push(form.value.message);
    console.log('messgaes => ', this.messages);
    this.message = '';
  }

}
