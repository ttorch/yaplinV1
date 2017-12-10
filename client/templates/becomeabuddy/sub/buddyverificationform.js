Template.buddyverificationform.helpers({
    'buddyId': function(){
        var id = FlowRouter.current().params.buddyId;
        return id;
    }
})

Template.buddyverificationform.events({
    'submit form':function(event){
        event.preventDefault();
        var target = event.target;
        data = {
            verificationCode: target.vcprefix.value +'-'+target.vcsuffix.value,
            id: target.bid.value
        }

        Meteor.call('VerifyBuddy', data, function(error, response){
            console.log(data,error,response);
            if (error) {
                Bart.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');              
                return false;
            }

            if (response === false) {
                Bart.alert("Invalid Verification Code", 'danger', 'fixed-top', 'fa-frown-o');  
                return false;
            }
            
            FlowRouter.go('buddy.addtour');
            
        });
        
    }
})