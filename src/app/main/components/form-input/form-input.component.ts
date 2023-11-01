import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent {
  @Input() form!: FormGroup;
  @Input() type: string = "text";
  @Input() placeholder!: string;
  @Input() name!: string;
  @Input() autocomplete: "on" | "off" = "off";
  @Input() label!: string;
  @Input() editMode: boolean = true;
  @Input() isReadOnly: boolean = false;
  @Input() asIcon: boolean = true;
  @Output() onValueChange: EventEmitter<string> = new EventEmitter<string>();


  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  onChange() {
    this.toggleEditMode();
    this.onValueChange.emit(this.name);
  }
}
