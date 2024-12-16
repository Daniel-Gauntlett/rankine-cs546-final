// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!
//data-background-color={{backgroundColor}} data-font-color={{fontColor}}

let checkString = (data, name) =>
    {
        if(!data) throw  `${name} isn't a valid non-empty string`;
        if(typeof data !== "string" || (data = data.trim()).length === 0) throw  `${name} isn't a valid non-empty string`;
        return data.trim();
    };

let checkIsValidPassword = (password) =>
{
  password = checkString(password, "Given password");
  let passtest1 = false;
  let passtest2 = false;
  let passtest3 = false;
  let uppercaseChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  let specialChars = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "}", "[", "]", "|", ":", ";", "'", "<", ">", ",", ".", "?", "/", "\\"];
  for (let i = 0; i < password.length; i++){
    if (uppercaseChars.includes(password[i])) passtest1 = true;
    if (specialChars.includes(password[i])) passtest2 = true;
    if (password[i] === "0" || Number(password[i]) > 0) passtest3 = true;
  }
  if (passtest1 && passtest2 && passtest3){
    passtest1 = true;
  }
  else{
    throw "Given password is invalid, must include an uppercase character, a special character, and a number.";
  }
}

let checkSignInUser = (username, password) => {
    username = checkString(username, "Username");
    password = checkString(password, "Password");
};

let checkCreateUser = (
    username,
    userPassword,
    firstName,
    lastName,
    confirmPassword
    ) => {
        if (!username) throw "No username given for the user";
        if (!userPassword) throw "No password given for the user";
        if (!firstName) throw "No first name given for the user";
        if (!lastName) throw "No last name given for the user";
        username = checkString(username, "Username");
        if (username.length < 5 || username.length > 10) throw "Given username is incorrect length";
        userPassword = checkIsValidPassword(userPassword);
        firstName = checkString(firstName, "First Name");
        if (firstName.length < 2 || firstName.length > 25) throw "Given first name is incorrect length";
        lastName = checkString(lastName, "Last Name");
        if (lastName.length < 2 || lastName.length > 25) throw "Given first name is incorrect length";
        if (confirmPassword !== userPassword) throw "Passwords must match."
        return true;
}


let signinform = document.getElementById('signin-form');
let signupform = document.getElementById('signup-form');
let errorDiv = document.getElementById('error');
if(signinform){
    signinform.addEventListener('submit', (event) => {
    try {
        checkSignInUser(document.getElementById('userId').value, document.getElementById('password').value);
    } catch (e) {
        console.log(e);
        event.preventDefault();
        errorDiv.hidden = false;
        errorDiv.innerHTML = 'Incorrect username or password';
        document.getElementById('password').value = '';
    }
    });
}

if(signupform){
    signupform.addEventListener('submit', (event) => {
        try {
            checkCreateUser(document.getElementById('userId').value, document.getElementById('password').value);
        } catch (e) {
            console.log(e);
            event.preventDefault();
            errorDiv.hidden = false;
            errorDiv.innerHTML = e;
        }
    });
}