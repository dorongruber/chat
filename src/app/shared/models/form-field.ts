import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CustomValidators } from "./custom-validator";
export abstract class CustomBasicControl {
  control!: AbstractControl<any,any>;
  validators: CustomValidators | undefined;
  properties: {[key: string]: string | undefined};
  parent?: CustomBasicControl | undefined;
  constructor(label: string, validators?: CustomValidators)
    {
      this.properties = {};
      this.validators = validators;
      this.properties["label"] = label;
      this.properties["name"] = label.toLocaleLowerCase();
    }

  abstract ToRelatedFormFormat(fb: FormBuilder): AbstractControl<any,any>;

  abstract AsChildrens(): boolean;

  abstract GetChildrens(): CustomBasicControl[];

  Add(field: CustomBasicControl): void {};

  Remove(field: CustomBasicControl): void{};

}

const ContrllerMostHaveValidator: ValidatorFn = (control:
  AbstractControl): ValidationErrors | null =>  {
    return {NoValidatorsDefined: true};
  };

export class CustomControl extends CustomBasicControl {

  constructor(label: string, type:string
    , validators?: CustomValidators,
    { value = "", toolTip = undefined} :
    { value?: string, toolTip?: string} = {},
     ) {
      super(label , validators);
    this.properties["value"] = value;
    this.properties["type"] = type;
    this.properties["toolTip"] = toolTip;
  }

  ToRelatedFormFormat(fb: FormBuilder): AbstractControl<any, any> {
    this.control = fb.control(this.properties["value"], this.validators?.validatorFn);
    return this.control;
  }

  GetChildrens(): CustomBasicControl[] {
    return [this];
  };

  AsChildrens(): boolean {
      return false;
  }
}

export class CustomGroup extends CustomBasicControl {
  childrens: CustomBasicControl[];
  constructor(label: string, {validators = undefined, childrens = []} :
    {validators?: CustomValidators, childrens?: CustomBasicControl[]}
    = {}) {
      super(label, validators);
    this.childrens = childrens;
  }
  ToRelatedFormFormat(fb: FormBuilder): AbstractControl<any, any> {
    const formControls: {[key: string]: AbstractControl} = {};
    this.childrens.forEach(child => {
        formControls[child.properties["name"]!] = child.ToRelatedFormFormat(fb);

    });
    this.control = fb.group(formControls, {validators: this.validators?.validatorFn},);
    return this.control;
  }

  AsChildrens(): boolean {
    return this.childrens.length > 0;
  }

  GetChildrens(): CustomBasicControl[] {
    let flatted: CustomBasicControl[] = [];
    this.childrens.forEach(child => {
      flatted = flatted.concat(child.GetChildrens().flat());
    })
    return flatted;
  }

  Add(control: CustomBasicControl): void {
    if(!this.properties["label"]!.includes("main"))
      control.parent = this;
    this.childrens.push(control);
  }

  Remove(control: CustomBasicControl): void {
     const index = this.childrens.findIndex(c => c == control);
     this.childrens.splice(index,1);
  }

}


export class CustomArray extends  CustomGroup {
  constructor(label: string, {validators = undefined, childrens = []} :
    {validators?: CustomValidators, childrens?: CustomBasicControl[]}
    = {}) {
      super(label, {validators: validators, childrens: childrens});
  }

  ToRelatedFormFormat(fb: FormBuilder): AbstractControl<any, any> {
    const formControls: AbstractControl[] = [];
    this.childrens.forEach(child => {
        formControls.push(child.ToRelatedFormFormat(fb));

    });
    this.control = fb.array(formControls, {validators: this.validators?.validatorFn},);
    return this.control;
  }

  Add(control: CustomBasicControl): void {
    control.parent = this;
    this.childrens.push(control);
  }

  Remove(control: CustomBasicControl): void {
    const index = this.childrens.findIndex(c => c == control);
    this.childrens.splice(index,1);
 }
}