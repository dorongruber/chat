import { CustomArray, CustomControl, CustomGroup } from "src/app/shared/models/form-field"
import { ImageNameParams, UserNameParams } from "./forms-fields-params"
import { CustomValidators } from "src/app/shared/models/custom-validator"
import { Validators } from "@angular/forms"

const nameControl = new CustomControl(UserNameParams["label"], UserNameParams["type"],
    new CustomValidators(["required"],[Validators.required],[`Field is Required`])  
);

const usersNestedStructure = new CustomArray("users", {
    validators: new CustomValidators(["required"],[Validators.required],[`Field is Required`]), 
});

const imageControl = new CustomControl(ImageNameParams["label"], ImageNameParams["type"]);

const chatFormStructure = new CustomGroup("main group");
chatFormStructure.Add(nameControl);
chatFormStructure.Add(usersNestedStructure);
chatFormStructure.Add(imageControl);

export {
    chatFormStructure,
}