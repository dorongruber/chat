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

// export const loginFormStructure =
//   new FormField("login group", "login group", {childrens: [
//     new FormField(EmailParams["label"],EmailParams["type"],{validators: [
//     Validators.required,
//     Validators.email
//   ]}),
//   new FormField(PasswordParams["label"], PasswordParams["type"], {validators: [
//     Validators.required,
//     Validators.minLength(PasswordParams["minLength"]),
//     Validators.maxLength(PasswordParams["maxLength"]),
//     Validators.pattern(new RegExp(PasswordParams["regexPattern"]))
//   ]})
// ]});

// export const loginFormStructure = new authFormGroup("login group",
//   {childrens:
//     [
//       new AuthFormControl(EmailParams["label"],EmailParams["type"],{validators: [
//       Validators.required,
//       Validators.email
//     ]}),
//     new AuthFormControl(PasswordParams["label"], PasswordParams["type"], {validators: [
//       Validators.required,
//       Validators.minLength(PasswordParams["minLength"]),
//       Validators.maxLength(PasswordParams["maxLength"]),
//       Validators.pattern(new RegExp(PasswordParams["regexPattern"]))
//     ]})
//   ]
// });
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
//, {childrens: [emailLeaf, passwordLeaf]}
const loginFormStructure = new TestNode("login group");
loginFormStructure.Add(emailLeaf);
loginFormStructure.Add(passwordLeaf);

// export const registrationFormStracture =
//   new FormField("registration main form group", "main group", { childrens: [
//     new FormField(UserNameParams["label"],UserNameParams["type"] , {validators: [
//     Validators.required,]}),
//     new FormField(EmailParams["label"],EmailParams["type"],{validators: [
//       Validators.required,
//       Validators.email],}),
//     new FormField(PhoneParams["label"],PhoneParams["type"],{validators: [Validators.required,],}),
//       new FormField("passform", "password group", {validators: [PassValidator], childrens : [
//         new FormField(PasswordParams["label"], PasswordParams["type"], {validators: [
//           Validators.required,
//           Validators.minLength(PasswordParams["minLength"]),
//           Validators.maxLength(PasswordParams["maxLength"]),
//           Validators.pattern(new RegExp(PasswordParams["regexPattern"]))
//         ]}),
//         new FormField(ConfirmationPasswordParams["label"],ConfirmationPasswordParams["type"], {validators: [
//           Validators.required,]}),
//       ]},),
//     ]
//   });

// export const registrationFormStracture = new authFormGroup("registration main form group",
//   { childrens: [
//     new AuthFormControl(UserNameParams["label"],UserNameParams["type"] , {validators: [
//     Validators.required,]}),
//     new AuthFormControl(EmailParams["label"],EmailParams["type"],{validators: [
//       Validators.required,
//       Validators.email],}),
//     new AuthFormControl(PhoneParams["label"],PhoneParams["type"],{validators: [Validators.required,],}),
//     new authFormGroup("passform", {validators: [PassValidator], childrens : [
//       new AuthFormControl(PasswordParams["label"], PasswordParams["type"], {validators: [
//         Validators.required,
//         Validators.minLength(PasswordParams["minLength"]),
//         Validators.maxLength(PasswordParams["maxLength"]),
//         Validators.pattern(new RegExp(PasswordParams["regexPattern"]))
//       ]}),
//       new AuthFormControl(ConfirmationPasswordParams["label"],ConfirmationPasswordParams["type"], {validators: [
//         Validators.required,]}),
//     ]},),
//     ]
//   });

const userNameLeaf = new TestLeaf(UserNameParams["label"],UserNameParams["type"] , [
  Validators.required,]);
const phoneLeaf = new TestLeaf(PhoneParams["label"],PhoneParams["type"],[Validators.required,],);
const registrationFormStracture = new TestNode("registration main form group");
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
