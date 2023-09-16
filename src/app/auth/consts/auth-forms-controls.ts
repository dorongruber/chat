import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { TestLeaf, TestNode } from "../models/form-field";
import { ConfirmationPasswordParams, EmailParams, PasswordParams, PhoneParams, UserNameParams } from "./forms-fields-params";

export const PassValidator: ValidatorFn = (control:
  AbstractControl): ValidationErrors | null =>  {
    const pass = control.get(PasswordParams["label"].toLocaleLowerCase());
    const confpass = control.get(ConfirmationPasswordParams["label"].toLocaleLowerCase());
    if (( pass?.value !== confpass?.value) && pass && confpass) {
      return {NotEqualPasswords: true};
    }
    return null;
  };

const emailLeaf = new TestLeaf(EmailParams["label"],EmailParams["type"],[
  Validators.required,
  Validators.email
],);
const passwordLeaf = new TestLeaf(PasswordParams["label"], PasswordParams["type"], [
  Validators.required,
  Validators.minLength(PasswordParams["minLength"]),
  Validators.maxLength(PasswordParams["maxLength"]),
  Validators.pattern(new RegExp(PasswordParams["regexPattern"]))
]);

const loginFormStructure = new TestNode("main group");
loginFormStructure.Add(emailLeaf);
loginFormStructure.Add(passwordLeaf);

const userNameLeaf = new TestLeaf(UserNameParams["label"],UserNameParams["type"] , [
  Validators.required,]);
const phoneLeaf = new TestLeaf(PhoneParams["label"],PhoneParams["type"],[Validators.required,],);
const registrationFormStracture = new TestNode("main group");
registrationFormStracture.Add(userNameLeaf);
registrationFormStracture.Add(emailLeaf);
registrationFormStracture.Add(phoneLeaf);

const passVerificationLeaf = new TestLeaf(ConfirmationPasswordParams["label"],ConfirmationPasswordParams["type"], [
  Validators.required,]);
const confirmPasswordNode = new TestNode("passform", {validators: [PassValidator]});
confirmPasswordNode.Add(passwordLeaf);
confirmPasswordNode.Add(passVerificationLeaf);
registrationFormStracture.Add(confirmPasswordNode);

export {
  loginFormStructure,
  registrationFormStracture,
}
