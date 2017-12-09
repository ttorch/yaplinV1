Template.register.onRendered(function(){
    $('#app-signup').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            firstname: {
                required: true,
                minlength: 2
            },
            password: {
                required: true,
                minlength: 6
            }

        },
        message: {
            email: {
                required: 'Email field is required.',
                email: 'Please enter a valid email address.'
            },
            firstname: {
                required: 'First Name field is required.',
                minlength: 'Please enter at least 2 characters.'
            },
            password: {
                required: 'Password field is required.',
                minlength: 'Please enter at least 6 characters.'
            }
        }
    })
});

Template.register.events({
    'click #aLogin': function(){
        Session.set('showRegister', false);
    },
    'submit form': function(event){
        event.preventDefault();
        var target = event.target;
        var data = {
            email: target.email.value,
            firstname: target.firstname.value,
            lastName: target.lastname.value,
            password: target.password.value
        }
        
        Meteor.call('Signup', data, function(error, response){
            
            if (error) {
                console.log(error);
                Bart.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
            } else {
                Meteor.loginWithPassword(data.email, data.password);
                target.email.value = "";
                target.firstname.value = "";
                target.lastname.value = "";
                target.password.value = "";
                $("#accountPopUpWindow").modal('hide');
            }
        });
    }
})
