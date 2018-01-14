Template.recovery.helpers({
    'resetPassword' : function () {
        console.log("SET/GET PASSWORD TOKEN");
        if (Accounts._resetPasswordToken) {
            console.log(Accounts._resetPasswordLink);
            Session.set("resetPass", true);
        }
        return Session.get("resetPass");
    }
})

Template.recovery.events({
    'submit #recover' : function(event,t) {
        event.preventDefault();
        // var email=t.find('')
        var email = event.target.recoveryEmail.value;
        Accounts.forgotPassword({ email: email },  function(error){
            if (error) {
                Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o');
            } else {
                Bert.alert( 'Password reset link sent.', 'success', 'fixed-top', 'fa-check');
                event.target.recoveryEmail.value = "";
            }
            
        })
    }
})