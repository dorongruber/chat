import { AbstractControl, FormBuilder, ValidatorFn } from "@angular/forms";

// export class FormField {
//   value: string;
//   label: string;
//   name: string;
//   type: string;
//   toolTip?: string;
//   validators: ValidatorFn[] | null;
//   childrens: FormField[];

//   constructor(label: string, type:string,
//     {validators = null, value = "", childrens = [], toolTip = undefined} :
//     {validators?: ValidatorFn[] | null,value?: string, childrens?: FormField[],toolTip?: string} = {},
//      ) {
//     this.value = value;
//     this.label = label;
//     this.name = label.toLocaleLowerCase();
//     this.type = type;
//     this.validators = validators;
//     this.toolTip = toolTip;
//     this.childrens = childrens;
//   }

//   toFromControl(fb: FormBuilder) {
//     return fb.control(this.value, this.validators);
//   }

//   toFromGroup(fb: FormBuilder) {
//     const formControls: {[key: string]: AbstractControl} = {};
//     this.childrens.forEach(child => {
//       if(child.asChildrens()) {
//         formControls[child.name] = child.toFromGroup(fb);
//       } else {
//         formControls[child.name] = child.toFromControl(fb);
//       }
//     });
//     return fb.group(formControls, {validators: this.validators},);
//   }

//   asChildrens(): boolean {
//     return this.childrens.length > 0;
//   }
// }

export interface BasicFormElementActions {
  ToRelatedFormFormat(fb: FormBuilder): AbstractControl;
  AsChildrens(): boolean;
  GetFieldValue(key: string): string | undefined;
  GetChildrens(): BasicFormElementActions[];
  GetValidators(): ValidatorFn[] | null;
}

export class authFormGroup implements BasicFormElementActions {

  validators: ValidatorFn[] | null;
  childrens: BasicFormElementActions[];
  fields: {[key: string]: string | undefined} = {};
  constructor(label: string, {validators = null, childrens = []} :
    {validators?: ValidatorFn[] | null, childrens?: BasicFormElementActions[]}
    = {}) {
    this.validators = validators;
    this.childrens = childrens;
    this.fields["label"] = label;
    this.fields["name"] = label.toLocaleLowerCase();
  }
  GetChildrens(): BasicFormElementActions[] {
    return this.childrens;
  }
  GetValidators(): ValidatorFn[] | null {
    return this.validators;
  }

  AsChildrens(): boolean {
    return this.childrens.length > 0;
  }
  GetFieldValue(key: string): string | undefined {
    return this.fields[key];
  }

  ToRelatedFormFormat(fb: FormBuilder): AbstractControl<any, any> {
    const formControls: {[key: string]: AbstractControl} = {};
    this.childrens.forEach(child => {
        formControls[child.GetFieldValue("name")!] = child.ToRelatedFormFormat(fb);

    });
    return fb.group(formControls, {validators: this.validators},);
  }

}

export class AuthFormControl extends authFormGroup {

  constructor(label: string, type:string,
    {validators = null, value = "", toolTip = undefined} :
    {validators?: ValidatorFn[] | null,value?: string, toolTip?: string} = {},
     ) {
      super(label , {validators: validators});
    this.fields["value"] = value;
    this.fields["type"] = type;
    this.fields["toolTip"] = toolTip;
  }

  ToRelatedFormFormat(fb: FormBuilder): AbstractControl<any, any> {
      return fb.control(this.GetFieldValue("value"), this.validators);
  }

}
