import { Validators } from "@angular/forms";
import { CustomControl, CustomGroup } from "../../shared/models/form-field";
import { ConfirmationPasswordParams, EmailParams, PasswordParams, PhoneParams, UserNameParams } from "./forms-fields-params";
import { CustomValidators } from "../../shared/models/custom-validator";
import { PassValidator } from "./form-validators";

const emailLeaf = new CustomControl(EmailParams["label"],EmailParams["type"],
new CustomValidators(
  ["required", "email"],
  [Validators.required,Validators.email],
   [`Field is Required`,`Invalid ${EmailParams["label"]} Format`])
,);
const passwordLeaf = new CustomControl(PasswordParams["label"], PasswordParams["type"],
new CustomValidators(
  ["required", "minlength","maxlength","pattern"],
  [Validators.required,
  Validators.minLength(PasswordParams["minLength"]),
  Validators.maxLength(PasswordParams["maxLength"]),
  Validators.pattern(new RegExp(PasswordParams["regexPattern"]))],
[`Field is Required`,
`${PasswordParams["label"]} Min Length is ${PasswordParams["minLength"]}`,
`${PasswordParams["label"]} Max Length is ${PasswordParams["minLength"]}`,
`Invalid ${PasswordParams["label"]} Pattern`])
);

const loginFormStructure = new CustomGroup("main group");
loginFormStructure.Add(emailLeaf);
loginFormStructure.Add(passwordLeaf);

const userNameLeaf = new CustomControl(UserNameParams["label"],UserNameParams["type"] ,
new CustomValidators(
  ["required"],
  [Validators.required],
   [`Field is Required`])
);
const phoneLeaf = new CustomControl(PhoneParams["label"],PhoneParams["type"],
new CustomValidators(
  ["required"],
  [Validators.required],
  [`Field is Required`])
,);
const registrationFormStracture = new CustomGroup("main group");
registrationFormStracture.Add(userNameLeaf);
registrationFormStracture.Add(emailLeaf);
registrationFormStracture.Add(phoneLeaf);

const passVerificationLeaf = new CustomControl(ConfirmationPasswordParams["label"],
ConfirmationPasswordParams["type"],
new CustomValidators(
  ["required"],
  [Validators.required],
  [`Field is Required`])
);
const confirmPasswordNode = new CustomGroup("passform", {validators:
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
