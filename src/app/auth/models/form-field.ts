import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CustomValidators } from "./custom-validator";
export abstract class TestBasic {
  control!: AbstractControl<any,any>;
  validators: CustomValidators | undefined;
  properties: {[key: string]: string | undefined};
  parent?: TestBasic | undefined;
  constructor(label: string, validators?: CustomValidators)
    {
      this.properties = {};
      this.validators = validators;
      this.properties["label"] = label;
      this.properties["name"] = label.toLocaleLowerCase();
    }

  abstract ToRelatedFormFormat(fb: FormBuilder): AbstractControl<any,any>;

  abstract AsChildrens(): boolean;

  abstract GetChildrens(): TestBasic[];

  Add(field: TestBasic): void {};

  Remove(field: TestBasic): void{};

}

const ContrllerMostHaveValidator: ValidatorFn = (control:
  AbstractControl): ValidationErrors | null =>  {
    return {NoValidatorsDefined: true};
  };

export class TestLeaf extends TestBasic {

  constructor(label: string, type:string
    , validators: CustomValidators = new CustomValidators(["defualt validator"],[ContrllerMostHaveValidator], ["most difine validator"]),
    { value = "", toolTip = undefined} :
    { value?: string, toolTip?: string} = {},
     ) {
      super(label , validators);
    this.properties["value"] = value;
    this.properties["type"] = type;
    this.properties["toolTip"] = toolTip;
  }

  ToRelatedFormFormat(fb: FormBuilder): AbstractControl<any, any> {
    this.control = fb.control(this.properties["value"], this.validators!.validatorFn);
    return this.control;
  }

  GetChildrens(): TestBasic[] {
    return [this];
  };

  AsChildrens(): boolean {
      return false;
  }
}

export class TestNode extends TestBasic {
  childrens: TestBasic[];
  constructor(label: string, {validators = undefined, childrens = []} :
    {validators?: CustomValidators, childrens?: TestBasic[]}
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

  GetChildrens(): TestBasic[] {
    let flatted: TestBasic[] = [];
    this.childrens.forEach(child => {
      flatted = flatted.concat(child.GetChildrens().flat());
    })
    return flatted;
  }

  Add(control: TestBasic): void {
    if(!this.properties["label"]!.includes("main"))
      control.parent = this;
    this.childrens.push(control);
  }

  Remove(control: TestBasic): void {
     const index = this.childrens.findIndex(c => c == control);
     this.childrens.splice(index,1);
  }

}
