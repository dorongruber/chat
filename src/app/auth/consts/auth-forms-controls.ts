import { Validators } from "@angular/forms";
import { CustomControl, CustomGroup } from "../../shared/models/form-field";
import { ConfirmationPasswordParams, EmailParams, PasswordParams, PhoneParams, UserNameParams } from "./forms-fields-params";
import { CustomValidators } from "../../shared/models/custom-validator";
import { PassValidator } from "./form-validators";

const emailControl = new CustomControl(EmailParams["label"],EmailParams["type"],
new CustomValidators(
  ["required", "email"],
  [Validators.required,Validators.email],
   [`Field is Required`,`Invalid ${EmailParams["label"]} Format`])
,);
const passwordControl = new CustomControl(PasswordParams["label"], PasswordParams["type"],
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
loginFormStructure.Add(emailControl);
loginFormStructure.Add(passwordControl);

const userNameControl = new CustomControl(UserNameParams["label"],UserNameParams["type"] ,
new CustomValidators(
  ["required"],
  [Validators.required],
   [`Field is Required`])
);
const phoneControl = new CustomControl(PhoneParams["label"],PhoneParams["type"],
new CustomValidators(
  ["required"],
  [Validators.required],
  [`Field is Required`])
,);
const registrationFormStracture = new CustomGroup("main group");
registrationFormStracture.Add(userNameControl);
registrationFormStracture.Add(emailControl);
registrationFormStracture.Add(phoneControl);

const passVerificationControl = new CustomControl(ConfirmationPasswordParams["label"],
ConfirmationPasswordParams["type"],
new CustomValidators(
  ["required"],
  [Validators.required],
  [`Field is Required`])
);
const confirmPasswordNode = new CustomGroup("passform", {validators:
  new CustomValidators(
    ["NotEqualPasswords"],
    [PassValidator(passVerificationControl)],
    [`password dont match`])

  });
confirmPasswordNode.Add(passwordControl);
confirmPasswordNode.Add(passVerificationControl);
registrationFormStracture.Add(confirmPasswordNode);

export {
  loginFormStructure,
  registrationFormStracture,
}
