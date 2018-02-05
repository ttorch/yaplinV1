Template.forgotpwd.onRendered(function(){
    $('#forgotPwdForm').validate({
        rules: {
            recoveryemail: {
                required: true,
                email: true
            }
        },
        message: {
            email: {
                required: 'Email field is required.',
                email: 'Please enter a valid email address.'
            }
        }
    })
});

Template.forgotpwd.events({
    'submit #forgotPwdForm' :  function(event, t) {
        event.preventDefault();
        var email = event.target.recoveryemail.value;
        console.log("FORGOT PASSWORD " + email);
        if (email != undefined) {
            Accounts.forgotPassword({ email: email },  function(error){
                if (error) {
                    Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                } else {
                    console.log(Accounts._resetPasswordToken);
                    Bert.alert( 'Password reset link sent.', 'success', 'fixed-top', 'fa-check');
                    event.target.recoveryEmail.value = "";
                }
            })
        } else {
            return false;
        }
    }
})