const { validateEmail, validatePassword } = require("./login-validator");

function nameValidator(name) {
    var usernameRegex = /^(\w+( \w+)*){1,5}$/;
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
    const { newUser } = req.body;
    if(!nameValidator(newUser._firstName))
        return res.sendStatus(401);
    if(!phoneValidator(newUser._phone))
        return res.sendStatus(401);
    if(!validateEmail(newUser._email))
        return res.sendStatus(401);
    if(!validatePassword(newUser._password))
        return res.sendStatus(401);
    next();
}

function updatedUserValidator(req, res, next) {
    const  user  = req.body;
    if(!nameValidator(user.name))
        return res.sendStatus(401);
    if(!phoneValidator(user.phone))
        return res.sendStatus(401);
    if(!validateEmail(user.email))
        return res.sendStatus(401);
    next();
}

module.exports = {
    userValidator,
    updatedUserValidator,
}