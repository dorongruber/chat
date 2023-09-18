import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CustomValidators } from "./custom-validator";
export abstract class TestBasic {
  //validators: ValidatorFn[] | undefined;
  validators: CustomValidators | undefined;
  properties: {[key: string]: string | undefined};
  parentProps: {[key: string]: string | undefined} | undefined;
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


  // GetValidators(): ValidatorFn[] | undefined {
  //   return this.validators;
  // };

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
    return fb.control(this.properties["value"], this.validators!.validatorFn);
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
    return fb.group(formControls, {validators: this.validators?.validatorFn},);
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

  Add(controller: TestBasic): void {
    if(!this.properties["label"]!.includes("main"))
      controller.parentProps = this.properties;
    this.childrens.push(controller);
  }

  Remove(controller: TestBasic): void {
     const index = this.childrens.findIndex(c => c == controller);
     this.childrens.splice(index,1);
  }

}
