console.log('Sign up script loaded!');

const emailRegex = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const nameRegex = new RegExp(/^[A-Za-z\s]+$/);
const companyRegex = new RegExp(/^[A-Za-z0-9\s_]+$/);

const nameField = document.getElementById('submit-name');
const emailField = document.getElementById('submit-email');
const companyField = document.getElementById('submit-company')
const passwordField = document.getElementById('submit-password');
const confirmField = document.getElementById('submit-confirm-password');
const errorField = document.getElementById('error');
const fields = [nameField, emailField, companyField, passwordField, confirmField];

const signupButton = document.getElementById('signup-button');
signupButton.addEventListener('click', getSignupData);

const ipcRenderer = require('electron').ipcRenderer;

function getSignupData(){

    var nameState, companyState, emailState, passwordState, confirmState = false;
    errorField.style.visibility = 'hidden';

    //all the fields can be empty, generate an error for this
    fields.forEach(function(element) {
        errorField.classList.remove('okay');
        element.classList.remove('invalidInput');

        value = element.value;
        if(value.length == 0){
            errorField.innerHTML = 'One or more values are empty';
            errorField.style.visibility = 'visible';

            element.classList.add('invalidInput');
            return false;
        }
        else {
            switch(element){
                //checking the name text
                case nameField:
                    if(!validate(nameRegex, value)){
                        element.classList.add('invalidInput');
                        errorField.innerHTML = 'Name contains invalid characters';
                        errorField.style.visibility = 'visible';
                        return false;
                    }
                    element.classList.add('validInput');
                    nameState = true;
                    break;

                //checking the company text - must contain only numbers and letters
                case companyField:
                    if(!validate(companyRegex, value)){
                        element.classList.add('invalidInput');
                        errorField.innerHTML = 'Company name contains invalid characters';
                        errorField.style.visibility = 'visible';
                        return false;
                    }
                    element.classList.add('validInput');
                    companyState = true;
                    break;

                //check if the email respects the format
                case emailField:
                    if(!validate(emailRegex, value)){
                        element.classList.add('invalidInput');
                        errorField.innerHTML = 'Email format is invalid';
                        errorField.style.visibility = 'visible';
                        return false;
                    }

                    element.classList.add('validInput');
                    emailState = true;
                    break;

                //must be at least 8 characters
                //must have at least a uppercase letter
                //must have at least one number
                case passwordField:
                    if(value.length < 8 || value.length > 32){
                        element.classList.add('invalidInput');
                        errorField.innerHTML = 'Password needs to be 8-32 characters long';
                        errorField.style.visibility = 'visible';
                        return false;
                    }
                    
                    var passRegExNumber = new RegExp(/[0-9]/);                    
                    if(!value.match(passRegExNumber)){
                        element.classList.add('invalidInput');
                        errorField.innerHTML = 'Password needs to contain at least one number';
                        errorField.style.visibility = 'visible';
                        return false;
                    }

                    var passRegExUppercase = new RegExp(/[A-Z]/);
                    if(!value.match(passRegExUppercase)){
                        element.classList.add('invalidInput');
                        errorField.innerHTML = 'Password needs to contain at least one uppercase letter';
                        errorField.style.visibility = 'visible';
                        return false;
                    }

                    element.classList.add('validInput');
                    passwordState = true;
                    break;
                    
                //check if the passwords match
                case confirmField:
                    if(!(value === passwordField.value)){
                        element.classList.add('invalidInput');
                        errorField.innerHTML = 'Passwords do not match';
                        errorField.style.visibility = 'visible';
                        return false;
                    }

                    element.classList.add('validInput');
                    confirmState = true;
                break;
                    
                default:
                    break;
            }
        }

    }, this);

    if(!nameState || !emailState || !passwordState || !confirmState){
        return false;
    }

    // show the user that the data that he entered is correct
    errorField.classList.remove('error');
    errorField.classList.add('okay');
    errorField.innerHTML = 'All is good to go!'
    errorField.style.visibility = 'visible';

    // send the data to the main process
    userData = {"email": emailField.value, 
                "password": passwordField.value, 
                "name": nameField.value, 
                "company": companyField.value};
    ipcRenderer.send('user-signup', userData);

    return true;
}

function validate(regex, value){
    return regex.test(value);
}

function valueOnChange(field, regex){
    var value = field.value;
    if(value.length == 0 || !validate(regex, value)){
        field.classList.add('invalidInput');
        return false;
    }
    field.classList.remove('invalidInput');
    field.classList.add('validInput');
    return true;
}
