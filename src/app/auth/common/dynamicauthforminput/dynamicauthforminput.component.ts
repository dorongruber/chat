import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
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
  control!: AbstractControl<any,any>;
  private path!: string;
  constructor() {
  }

  ngOnChanges() {
    this.label = this.formField.properties["label"]!;
    this.name = this.formField.properties["name"]!;
    this.type = this.formField.properties["type"]!;
    this.path = this.subGroupName ? `${this.subGroupName}.${this.name}` : this.name;
    this.control = this.getController(this.path)!;
  }

  getErrorMsg() {
    const key = Object.keys(this.control.errors!)[0];
    return this.formField.validators?.getErrorMsg(key);
  }
  getController(name: string) {
    return this.form.get(name);
  }
}
