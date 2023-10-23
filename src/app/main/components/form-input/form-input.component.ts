import { Component, Input } from '@angular/core';
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
  @Input() formControlName!: string;
  @Input() autocomplete: "on" | "off" = "off";
  @Input() label!: string;
}
