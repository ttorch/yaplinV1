Template.login.onRendered(function(){
   $('#app-login').validate({
        rules: {
            loginEmail: {
                required: true,
            },
           loginPassword: {
                required: true,
            },

        },
        messages: {
            loginEmail: {
                required: 'Email is required.',
            },
            loginPassword: {
                required: 'Password is required.',
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

Template.login.events({
    'click #aRegister': function(event) {
        Session.set('showRegister', true)
    },
    'submit form': function(event) {
        event.preventDefault();
        var target = event.target;
        var email_var = target.loginEmail.value;
        var password_var = target.loginPassword.value;
        
        Meteor.loginWithPassword(email_var, password_var, function(error) {
            if (error) {
                Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o');
            } else {
                target.loginEmail.value = '';
                target.loginPassword.value = '';
                $("#accountPopUpWindow").modal('hide');
            }
        });
    }
});