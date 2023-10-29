import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements OnChanges {
  @Input() form!: FormGroup;
  @Input() type: string = "text";
  @Input() placeholder!: string;
  @Input() name!: string;
  @Input() autocomplete: "on" | "off" = "off";
  @Input() label!: string;
  @Input() editMode: boolean = true;
  @Input() isReadOnly: boolean = false;
  value: string | undefined;

  @Output() onValueChange: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
      this.value = this.form.get(this.name)?.value;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  onChange() {
    this.toggleEditMode();
    this.onValueChange.emit(this.name);
  }
}
