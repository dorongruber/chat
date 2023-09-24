import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CustomBasicControl } from "../models/form-field";
import { ConfirmationPasswordParams, PasswordParams } from "./forms-fields-params";

export function PassValidator(controlLeaf: CustomBasicControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get(PasswordParams["label"].toLocaleLowerCase())!;
    const confPass = control.get(ConfirmationPasswordParams["label"].toLocaleLowerCase())!;
    if(pass.value != confPass.value) {
      controlLeaf.validators?.addValidator("NotEqualPasswords", `password dont match`);
      confPass.setErrors({NotEqualPasswords: true});
      return {NotEqualPasswords: true};
    }
    return null;
  }
};
