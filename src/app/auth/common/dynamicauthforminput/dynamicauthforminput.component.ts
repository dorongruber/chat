import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TestBasic } from '../../models/form-field';

@Component({
  selector: 'app-dynamic-authform-input',
  templateUrl: './dynamicauthforminput.component.html',
  styleUrls: ['./dynamicauthforminput.component.scss']
})
export class DynamicauthforminputComponent implements OnChanges  {
  @Input() form!: FormGroup;
  @Input() formField!: TestBasic;
  @Input() subGroupName: string | undefined = undefined;
  label!: string;
  name!: string;
  type!: string;
  constructor() {
  }

  ngOnChanges() {
    this.label = this.formField.properties["label"]!;
    this.name = this.formField.properties["name"]!;
    this.type = this.formField.properties["type"]!;
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
