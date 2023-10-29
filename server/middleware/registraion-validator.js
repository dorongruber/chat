const { validateEmail, validatePassword } = require("./login-validator");

function nameValidator(name) {
    var usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    name = name.trim();
    if(!name)
        return false;
    if(name.length < 3)
        return false;
    if(name.length > 15)
        return false;
    return usernameRegex.test(name);
}

function phoneValidator(phone) {
    var cleanedPhoneNumber = phone.replace(/\D/g, '');
    cleanedPhoneNumber = cleanedPhoneNumber.trim();
    if(!cleanedPhoneNumber)
        return false;
    return cleanedPhoneNumber.length == 10;
}

function userValidator(req,res,next) {
    const { user } = req.body;
    if(!nameValidator(user._firstName))
        return res.setStatus(401);
    if(!phoneValidator(user._phone))
        return res.setStatus(401);
    if(!validateEmail(user._email))
        return res.setStatus(401);
    if(!validatePassword(user._password))
        return res.setStatus(401);
    next();
}

function updatedUserValidator(req, res, next) {
    console.log("req ===> ", req);
    const { user } = req.data;
    console.log("user ==> ", user);
    if(!nameValidator(user.name))
        return res.setStatus(401);
    if(!phoneValidator(user.phone))
        return res.setStatus(401);
    if(!validateEmail(user.email))
        return res.setStatus(401);
    next();
}

module.exports = {
    userValidator,
    updatedUserValidator,
}