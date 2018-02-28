import { Accounts } from 'meteor/accounts-base'

Template.resetpwd.onRendered(function(){
    $('#resetPwdForm').validate({
        rules: {
            newpassword: {
                required: true,
            },
           confirmpassword: {
                required: true,
                equalTo: "[name=newpassword]"
            }
        },
        messages: {
            newpassword: {
                required: 'New Password is required.',
            },
            confirmpassword: {
                required: 'Confirm Password is required.',
                equalTo: 'New Password & Confirm Password does not match.'
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
        
        Accounts.resetPassword(Session.get('resetPassword'), newPassword, function(error){
            if (error) {
                Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o');
            } else {
                Bert.alert( 'Your password has been changed. Welcome back!', 'success', 'fixed-top', 'fa-check');
                Session.set('resetPassword', null);
                FlowRouter.go('/');
            }
        });      
    }
})

