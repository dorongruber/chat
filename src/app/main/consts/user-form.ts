import { CustomControl, CustomGroup } from "src/app/shared/models/form-field"
import { EmailNameParams, ImageNameParams, PhoneNameParams, UserNameParams } from "./forms-fields-params"
import { CustomValidators } from "src/app/shared/models/custom-validator"
import { Validators } from "@angular/forms"

const nameControl = new CustomControl(UserNameParams["label"], UserNameParams["type"],
    new CustomValidators(["required"],[Validators.required],[`Field is Required`])  
);

const emailControl = new CustomControl(EmailNameParams["label"], EmailNameParams["type"],
    new CustomValidators(["required"],[Validators.required],[`Field is Required`])  
);

const phoneControl = new CustomControl(PhoneNameParams["label"], PhoneNameParams["type"],
    new CustomValidators(["required"],[Validators.required],[`Field is Required`])  
);

const imageControl = new CustomControl(ImageNameParams["label"], ImageNameParams["type"]);

const userFormStructure = new CustomGroup("main group");
userFormStructure.Add(nameControl);
userFormStructure.Add(emailControl);
userFormStructure.Add(phoneControl);
userFormStructure.Add(imageControl);

export {
    userFormStructure,
}