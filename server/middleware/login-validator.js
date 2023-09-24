const minLength = 6;
const maxLength= 12;

module.exports.validateEmail = function validateEmail(email) {
    // Regular expression for a valid email address
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
    // Test the email against the regex
    return emailRegex.test(email);
}

module.exports.validatePassword = function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,12})$/;
    password = password.trim();
    if(!password)
        return false;
    if(password.length < minLength)
        return false;
    if(password.length > maxLength)
        return false;
    return passwordRegex.test(password);
}

module.exports.loginUserValidator = function loginUserValidator(req,res,next) {
    if(!validateEmail(req.user._email))
        return res.sendStatus(401);
    if(!validatePassword(req.user._password))
        return res.sendStatus(401);
    next();
}