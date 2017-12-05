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