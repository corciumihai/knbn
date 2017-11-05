function getLoginData(){
    var emailInput = document.getElementById('login-email');
    var passwordInput = document.getElementById('login-password');

    var email = emailInput.value;
    var password = passwordInput.value;

    console.log(email + '--' + password);
}