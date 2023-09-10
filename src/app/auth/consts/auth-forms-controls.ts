import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { AuthFormControl, authFormGroup } from "../models/form-field";
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

export const loginFormStructure =
  new authFormGroup("login group", {childrens: [
    new AuthFormControl(EmailParams["label"],EmailParams["type"],{validators: [
    Validators.required,
    Validators.email
  ]}),
  new AuthFormControl(PasswordParams["label"], PasswordParams["type"], {validators: [
    Validators.required,
    Validators.minLength(PasswordParams["minLength"]),
    Validators.maxLength(PasswordParams["maxLength"]),
    Validators.pattern(new RegExp(PasswordParams["regexPattern"]))
  ]})
]});


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

export const registrationFormStracture =
  new authFormGroup("registration main form group", { childrens: [
    new AuthFormControl(UserNameParams["label"],UserNameParams["type"] , {validators: [
    Validators.required,]}),
    new AuthFormControl(EmailParams["label"],EmailParams["type"],{validators: [
      Validators.required,
      Validators.email],}),
    new AuthFormControl(PhoneParams["label"],PhoneParams["type"],{validators: [Validators.required,],}),
      new authFormGroup("passform", {validators: [PassValidator], childrens : [
        new AuthFormControl(PasswordParams["label"], PasswordParams["type"], {validators: [
          Validators.required,
          Validators.minLength(PasswordParams["minLength"]),
          Validators.maxLength(PasswordParams["maxLength"]),
          Validators.pattern(new RegExp(PasswordParams["regexPattern"]))
        ]}),
        new AuthFormControl(ConfirmationPasswordParams["label"],ConfirmationPasswordParams["type"], {validators: [
          Validators.required,]}),
      ]},),
    ]
  });
