Template.myaccount.events({
    'click #dob':function(){
        $('#dob').datetimepicker({
            format: 'DD/MM/YYYY'
        });
    },
    'change #profileimage': function(event, tmpl) {
        var imageUrl = ''
        // var file = $('#profileimage').get(0).files[0];
        // if (file) {
        //     console.log("Uploaded File");
        //     console.log(file);
        // }
        FS.Utility.eachFile(event, function(file){
            ProfileImages.insert(file, function(err, fileObj){
                if (!err){
                    imageUrl = '/cfs/files/images/' + fileObj._id;
                    setTimeout(function(){
                        data = {
                            imageurl: imageUrl
                        }

                        Meteor.call('UpdateProfileImage', data, function(error, response){
                            if (error) {
                                Bart.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                                $('#btn-submit-profile').html('Submit'); 
                                $('#btn-submit-profile').prop('disabled',false);                
                                return false;
                            }
                        })
                    }, 3000);
                } else {
                    console.log("MY ACCOUNT FS ERROR");
                    console.log(err);
                }
            });
        });

        console.log("imageUrl", imageUrl);
    },
    'submit form':function(event){
        event.preventDefault();
        
        var target = event.target;
 
        $('#btn-submit-profile').prop('disabled',true);
        $('#btn-submit-profile').html('Submitting Information...'); 

        var imageUrl = $('#avatar').attr("src");

        data = {
            firstname: target.firstname.value,
            lastname: target.lastname.value,
            gender: target.gender.value,
            dateofbirth: target.dateofbirth.value,
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