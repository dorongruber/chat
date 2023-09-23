import { Validators } from "@angular/forms";
import { TestLeaf, TestNode } from "../models/form-field";
import { ConfirmationPasswordParams, EmailParams, PasswordParams, PhoneParams, UserNameParams } from "./forms-fields-params";
import { CustomValidators } from "../models/custom-validator";
import { PassValidator } from "./form-validators";

const emailLeaf = new TestLeaf(EmailParams["label"],EmailParams["type"],
new CustomValidators(
  ["required", "email"],
  [Validators.required,Validators.email],
   [`${EmailParams["label"]} Field is Required`,`Invalid ${EmailParams["label"]} Format`])
,);
const passwordLeaf = new TestLeaf(PasswordParams["label"], PasswordParams["type"],
new CustomValidators(
  ["required", "minlength","maxlength","pattern"],
  [Validators.required,
  Validators.minLength(PasswordParams["minLength"]),
  Validators.maxLength(PasswordParams["maxLength"]),
  Validators.pattern(new RegExp(PasswordParams["regexPattern"]))],
[`${PasswordParams["label"]} Field is Required`,
`${PasswordParams["label"]} Min Length is ${PasswordParams["minLength"]}`,
`${PasswordParams["label"]} Max Length is ${PasswordParams["minLength"]}`,
`Invalid ${PasswordParams["label"]} Pattern`])
);

const loginFormStructure = new TestNode("main group");
loginFormStructure.Add(emailLeaf);
loginFormStructure.Add(passwordLeaf);

const userNameLeaf = new TestLeaf(UserNameParams["label"],UserNameParams["type"] ,
new CustomValidators(
  ["required"],
  [Validators.required],
   [`${UserNameParams["label"]} Field is Required`])
);
const phoneLeaf = new TestLeaf(PhoneParams["label"],PhoneParams["type"],
new CustomValidators(
  ["required"],
  [Validators.required],
  [`${PhoneParams["label"]} Field is Required`])
,);
const registrationFormStracture = new TestNode("main group");
registrationFormStracture.Add(userNameLeaf);
registrationFormStracture.Add(emailLeaf);
registrationFormStracture.Add(phoneLeaf);

const passVerificationLeaf = new TestLeaf(ConfirmationPasswordParams["label"],
ConfirmationPasswordParams["type"],
new CustomValidators(
  ["required"],
  [Validators.required],
  [`${ConfirmationPasswordParams["label"]} Field is Required`])
);
const confirmPasswordNode = new TestNode("passform", {validators:
  new CustomValidators(
    ["NotEqualPasswords"],
    [PassValidator(passVerificationLeaf)],
    [`password dont match`])

  });
confirmPasswordNode.Add(passwordLeaf);
confirmPasswordNode.Add(passVerificationLeaf);
registrationFormStracture.Add(confirmPasswordNode);

export {
  loginFormStructure,
  registrationFormStracture,
}
