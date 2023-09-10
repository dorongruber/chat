import { Injectable } from "@angular/core";
//import { FormField } from "../models/form-field";
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { BasicFormElementActions } from "../models/form-field";

@Injectable({
  providedIn: "root"
})
export class AuthFormControlService {
  private fb: FormBuilder;
  constructor(formBuilder: FormBuilder) {
    this.fb = formBuilder;
  }

  InstantiateForm(formFieldsTree: BasicFormElementActions) {
    const structuredFrom = formFieldsTree.ToRelatedFormFormat(this.fb) as FormGroup;
    return structuredFrom;
  }
}
