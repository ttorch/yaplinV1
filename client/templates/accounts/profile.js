Template.profile.onCreated(function() {
    document.title = "Yaplin - Profile";
});

Template.profile.onRendered(function(){
    $('#account').validate({
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
        
        if (target.chktnc.checked === false) {
            Bert.alert( 'Before you can proceed, please accept the Terms and Conditions.', 'warning', 'growl-top-right', 'fa-exclamation-triangle' );
            return false;
        }
        var imageUrl = $('#avatar').attr("src");
        
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
            about: target.about.value,
            imageurl: imageUrl
        }

        Meteor.call('UpdateProfile', data, function(error, response){
            if (error) {
                Bart.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
            } else {
                Bart.alert('OK', 'success', 'growl-top-right', 'fa-frown-o');
            }
        });
    },
    'change input[type=file]':function(event) {
        // console.log(event);
        var output = document.getElementById('avatar');
        output.src = URL.createObjectURL(event.target.files[0]);
    }
})
