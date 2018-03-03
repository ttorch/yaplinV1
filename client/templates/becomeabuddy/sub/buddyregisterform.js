import { Buddies } from '../../../../imports/collections/buddiesCol.js';

Template.buddyregisterform.onCreated(function() {
    if(!Meteor.userId()){
        FlowRouter.go('becomeabuddy');
        Bert.alert("Please login to register as buddy.",'danger', 'fixed-top', 'fa-frown-o');
    }
    else{

        FlowRouter.subsReady("subsBuddies", function() {


                let buddy = Buddies.find({ userId: Meteor.userId() }).fetch()[0];

                if (buddy != undefined && buddy._id && buddy.verified === false) {
                    FlowRouter.go('becomeabuddy.status', { buddyId: buddy._id} );
                } else if (buddy != undefined && buddy._id && buddy.verified === true) {
                    FlowRouter.go('buddy.addtour');
                }
        });
    }
});

Template.buddyregisterform.onRendered(function(){
    $('#buddyregisterform').validate({
        rules: {
            firstname: {
                required: true,
            },
            gender:{
                required:true,
            },
           dateofbirth: {
                required: true,
                //date: true,
            },
            email: {
                required: true,
                email: true,
            },
            contact: {
                required: true,
                digits: true,
            },
            street: {
                required: true,
            },
            city: {
                required: true,
            },
            country: {
                required: true,
            },
            chktnc: {
                required: true,
            }

        },
        messages: {
            firstname: {
                required: "First Name is required.",
            },
            gender: {
                required: "Gender is required.",
            },
           dateofbirth: {
                required: "Date of birth is required.",
                //date: "Please enter a valid date of birth.",
            },
            email: {
                required: "Email is required.",
                email: "Please enter a valid email.",
            },
            contact: {
                required: "Contact Number is required.",
                digits: "Please enter only numbers in contact number.",
            },
            street: {
                required: "Street is required.",
            },
            city: {
                required: "City is required.",
            },
            country: {
                required: "Country is required",
            },
            chktnc:{
                required: "Before you can proceed, please accept the Terms and Conditions."
            }
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

Template.buddyregisterform.events({
    'click #dob':function(){
        $('#dob').datetimepicker({
            format: 'YYYY-MM-DD'
        });
    },
    'submit form':function(event){
        event.preventDefault();
        
        var target = event.target;
        if (target.chktnc.checked === false) {
            Bert.alert( 'Before you can proceed, please accept the Terms and Conditions.', 'warning', 'growl-top-right', 'fa-exclamation-triangle' );
            return false;
        }

        $('#btn-submit-profile').prop('disabled',true);
        $('#btn-submit-profile').html('Submitting Information...'); 
        
        var dob = moment(target.dateofbirth.value, "DD/MM/YYYY").format("YYYY-MM-DD");
        
        data = {
            firstname: target.firstname.value,
            lastname: target.lastname.value,
            gender: target.gender.value,
            dateofbirth: dob,
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