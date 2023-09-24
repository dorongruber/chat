import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomBasicControl } from '../../models/form-field';

@Component({
  selector: 'app-dynamic-authform-input',
  templateUrl: './dynamicauthforminput.component.html',
  styleUrls: ['./dynamicauthforminput.component.scss']
})
export class DynamicauthforminputComponent implements OnChanges  {
  @Input() form!: FormGroup;
  @Input() formField!: CustomBasicControl;
  label!: string;
  name!: string;
  type!: string;
  subGroupName: string | undefined = undefined;
  constructor() {
  }

  ngOnChanges() {
    this.label = this.formField.properties["label"]!;
    this.name = this.formField.properties["name"]!;
    this.type = this.formField.properties["type"]!;
    this.getSubGroupName();
  }

  getSubGroupName() {
    this.subGroupName = this.formField.control.parent != this.form ? this.formField.parent!.properties.label : undefined;
  }

  getErrorMsg() {
    const field = this.formField;
    const control = this.formField.control;
    const key = Object.keys(control.errors!)[0];
    return field.validators?.getErrorMsg(key);
  }
  getController(name: string) {
    return this.formField.control.parent!.get(name);
  }
}
