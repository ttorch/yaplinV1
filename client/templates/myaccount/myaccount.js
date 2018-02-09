Template.myaccount.events({
    'click #dob':function(){
        $('#dob').datetimepicker({
            format: 'DD/MM/YYYY'
        });
    },
    'submit form':function(event){
        event.preventDefault();
        
        var target = event.target;
        
        console.log(moment(target.dateofbirth.value, "DD/MM/YYYY").format("YYYY-MM-DD"));
        
        $('#btn-submit-profile').prop('disabled',true);
        $('#btn-submit-profile').html('Submitting Information...'); 

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
                $('#btn-submit-profile').html('Submit'); 
                $('#btn-submit-profile').prop('disabled',false);                
                return false;
            }

            var vc = (Math.random().toString(36).slice(8)).toUpperCase();
            vc +=  (vc.length > 0? '-':'') + Math.floor((Math.random() * 999999) + 1);
            data = {
                images: null,
                code: vc
            }
            Meteor.call('BecomeABuddy', data, function(error, response){
                console.log('BAB FINAL RESPONSE: ',error,response);
                if (error){
                    Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
                    $('#btn-submit-profile').html('Submit'); 
                    $('#btn-submit-profile').prop('disabled',false); 
                    return false;
                }

                if (response === false) {
                    Bert.alert( 'Verification email was not sent. Please try again.', 'danger', 'fixed-top', 'fa-frown-o' );
                    $('#btn-submit-profile').html('Submit'); 
                    $('#btn-submit-profile').prop('disabled',false);
                    console.log('CLIENT SEND ERROR', error);
                    return false;
                } else {
                    FlowRouter.go('becomeabuddy.status', { buddyId: response} );
                }
                
            });
            
        });

    }
});