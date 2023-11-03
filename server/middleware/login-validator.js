const minLength = 6;
const maxLength= 12;

function validateEmail(email) {
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,12})/;
    password = password.trim();
    if(!password)
        return false;
    if(password.length < minLength)
        return false;
    if(password.length > maxLength)
        return false;
    return passwordRegex.test(password);
}

function loginUserValidator(req,res,next) {
    const { isUser } = req.body;
    if(!validateEmail(isUser._email)) 
        return res.sendStatus(401);
    if(!validatePassword(isUser._password))
        return res.sendStatus(401);
    next();
}

module.exports = {
    validateEmail,
    validatePassword,
    loginUserValidator
}