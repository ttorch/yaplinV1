Template.myaccount.onRendered(function(){
    $('#account').validate({
        rules: {
            firstname: {
                required: true,
            },
            contact: {
                required: true,
                minlength: 8
            }

        },
        messages: {
            firstname: {
                required: 'First Name field is required.',
            },
            contact: {
                required: 'Password field is required.',
                minlength: 'Please enter at least 8 characters.'
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
    
    if(!Meteor.userId()){
        FlowRouter.go("/");
    }
});

Template.myaccount.events({
    'click #dob':function(){
        $('#dob').datetimepicker({
            format: 'DD/MM/YYYY'
        });
    },
    'submit form':function(event){
        event.preventDefault();
        
        var target = event.target;
        
        var dob = moment(target.dateofbirth.value, "DD/MM/YYYY").format("YYYY-MM-DD");
        
        $('#btn-submit-profile').prop('disabled',true);
        $('#btn-submit-profile').html('Submitting Information...'); 

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
                Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                $('#btn-submit-profile').html('Submit'); 
                $('#btn-submit-profile').prop('disabled',false);                
                return false;
            }else{
                Bert.alert("Profile updated successfully!", 'success', 'fixed-top', 'fa-happy-o');
                $('#btn-submit-profile').html('Submit'); 
                $('#btn-submit-profile').prop('disabled',false); 
            }

            var vc = (Math.random().toString(36).slice(8)).toUpperCase();
            vc +=  (vc.length > 0? '-':'') + Math.floor((Math.random() * 999999) + 1);
            data = {
                images: null,
                code: vc
            }
        
        });

    }
});

Template.registerHelper('formatDob',function(dob){
    
    return moment(dob, "YYYY-MM-DD").format("DD/MM/YYYY");
    
});