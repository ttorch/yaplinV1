Template.forgotpwd.onRendered(function(){
    $('#forgotPwdForm').validate({
        rules: {
            recoveryemail: {
                required: true,
                email: true
            }
        },
        messages: {
            recoveryemail: {
                required: 'Email is required.',
                email: 'Please enter a valid email.'
            },
        },
        invalidHandler: function(event, validator) {
            // 'this' refers to the form
            var numOfErrors = validator.numberOfInvalids();
            var msg = "";
            
            if (numOfErrors) {
               
               _.forEach(validator.invalid, function(k,v){
                   msg+=k+"<br>";
               });
               
              Bert.alert(msg, 'danger', 'fixed-top', 'fa-frown-o');
            }
        },
        errorPlacement: function(error, element) {
            
        },
        focusInvalid: false
    });
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