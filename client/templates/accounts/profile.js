Template.profile.helpers({
    'gender': function(){
        return Meteor.static.gender;
    },
    'country': function(){
        return Meteor.static.country;
    }
})

Template.profile.events({
    'click #dob':function(){
        $('#dob').datetimepicker({
            format: 'YYYY-MM-DD'
        });
    },
    'submit form':function(event){
        var target = event.target;
        if (target.chktnc.checked === false) {
            Bert.alert( 'Before you can proceed, please accept the Terms and Conditions.', 'warning', 'growl-top-right', 'fa-exclamation-triangle' );
            return false;
        }

        data = {
            firstname: target.firstname.value,
            lastname: target.lastname.value,
            gender: target.gender.value,
            dateofbirth: target.dateofbirth.value,
            contact: target.contact.value,
            street: target.street.value,
            city: target.city.value,
            country: target.country.value,
            about: target.about.value
        }

        Meteor.call('UpdateProfile', data, function(error, response){
            if (error) {
                Bart.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
            } else {
                Bart.alert('OK', 'success', 'growl-top-right', 'fa-frown-o');
            }
        });

    }
})
