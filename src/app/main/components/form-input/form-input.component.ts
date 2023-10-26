import { Component, Input, OnChanges } from '@angular/core';
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
  @Input() enableRadonly: boolean = false;
  isReadOnly: boolean = false;

  ngOnChanges(): void {
      this.isReadOnly = this.enableRadonly;
  }
}
