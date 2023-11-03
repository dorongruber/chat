import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {
  @Output() onInputValueChane: EventEmitter<string>;
  public inputValue: string;

  constructor() {
    this.inputValue = '';
    this.onInputValueChane = new EventEmitter<string>();
  }

  public handleDebouncedKeyUp(event: any): void {
    this.inputValue = event.target.value;
    this.onInputValueChane.emit(this.inputValue);
  }
}
