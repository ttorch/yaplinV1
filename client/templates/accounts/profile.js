Template.profile.helpers({
    'gender': function(){
        return Meteor.static.gender;
    },
    'country': function(){
        return Meteor.static.country;
    },
    'selectedOptions': function(selected, value){
        return selected == value ? "selected" : "";
    }
})

Template.profile.events({
    'click #dob':function(){
        $('#dob').datetimepicker({
            format: 'DD/MM/YYYY'
        });
    },
    'submit form':function(event){
        
        // Prevent default browser form submit
        event.preventDefault();
        event.stopPropagation();
    
        var target = event.target;
        
        console.log("here");
        if (target.chktnc.checked === false) {
            Bert.alert( 'Before you can proceed, please accept the Terms and Conditions.', 'warning', 'growl-top-right', 'fa-exclamation-triangle' );
            return false;
        }
        
        console.log(moment(target.dateofbirth.value).format("YYYY-MM-DD"));
        data = {
            firstname: target.firstname.value,
            lastname: target.lastname.value,
            gender: target.gender.value,
            dateofbirth: moment(target.dateofbirth.value).format("YYYY-MM-DD"),
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
