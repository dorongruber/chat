import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasicFormElementActions } from '../../models/form-field';

@Component({
  selector: 'app-dynamic-authform-input',
  templateUrl: './dynamicauthforminput.component.html',
  styleUrls: ['./dynamicauthforminput.component.scss']
})
export class DynamicauthforminputComponent {
  @Input() form!: FormGroup;
  @Input() formField!: BasicFormElementActions;
  @Input() formGroupName: string | null = null;
  constructor() {

  }
}
