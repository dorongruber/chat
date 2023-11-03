import { ValidatorFn } from "@angular/forms";

export class CustomValidators {
  private _validatorFns: ValidatorFn[];
  private validatorDic: {[key: string]: string} = {};
  constructor(errorTypes: string[],validatorFns: ValidatorFn[], errorMsgs: string[]) {
    this._validatorFns = validatorFns;
    for (let i = 0; i < errorTypes.length; i++) {
      this.validatorDic[errorTypes[i]] = errorMsgs[i];
    }
  }

  get validatorFn() {
    return this._validatorFns;
  }

  addValidator(errorType: string, errMsg: string) {
    if(!this.validatorDic[errorType])
      this.validatorDic[errorType] = errMsg;
  }

  getErrorMsg(type: string) {
    return this.validatorDic[type];
  }
}
