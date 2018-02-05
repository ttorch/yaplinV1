import { Accounts } from 'meteor/accounts-base'

Template.recovery.onCreated(function() {
    document.title = "Yaplin - User Password Recovery";
    $('#accountPopUpWindow').modal('toggle');
});

Template.recovery.helpers({
    resetPassword: function(){
        if (Session.get('resetPassword') != undefined) {
            return true;
        } else {
            return false;
        }
    }
});

Template.resetpwd.events({
    'submit #resetPwdForm' : function(event, t) {
        event.preventDefault();
        var resetPasswordToken = FlowRouter.getParam('token');
        newPassword = event.target.newpassword.value;
        passwordConfirm = event.target.confirmpassword.value;
        
        if (newPassword == passwordConfirm) { 
            Accounts.resetPassword(Session.get('resetPassword'), newPassword, function(error){
                if (error) {
                    Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                } else {
                    Bert.alert( 'Your password has been changed. Welcome back!', 'success', 'fixed-top', 'fa-check');
                    Session.set('resetPassword', null);
                    FlowRouter.go('/');
                }
            })
        } else {
            Bert.alert( "Password mismatch! Please try again.", 'warning', 'fixed-top', 'fa-frown-o');
            return false;
        }        
    }
})

