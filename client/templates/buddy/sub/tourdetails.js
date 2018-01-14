import { Buddies } from '../../../../imports/collections/buddiesCol.js';

Template.tourdetails.onCreated(function(){
    
    var self = this;
    self.tourdetails = new ReactiveVar({});
    self.numOfGuests = new ReactiveVar({});
    
    var title = "Yaplin - Tour Details";
    DocHead.setTitle(title);
   
});

Template.tourdetails.onRendered(function(){
    
   $(window).scroll(function() {    
        var scroll = $(window).scrollTop();

        if (scroll >= 215) {

            $("#form-book").addClass("position-book");
        }else {

                $("#form-book").removeClass("position-book");
        }

    });

   const instance = Template.instance();
   
   var tourId = FlowRouter.getParam("tourId");
    
    var data = {
        "tour_id":tourId
    };
    
    Meteor.call("getTourDetails",data,function(error,response){
        
        if (error) {
            console.log(error);
            Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            instance.tourdetails.set(response);
        }
    });
    
    var data = {
        "_id":tourId
    };
    
    Meteor.call("getNumGuest",data,function(error,response){

        if (error) {
            console.log(error);
            Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            instance.numOfGuests.set(response);

            var max = parseInt(instance.numOfGuests.get())+1;

            instance.numOfGuests.set(max);

        }
    });
    
});

Template.tourdetails.events({
    'submit form': function(event, template){
        event.preventDefault();
        event.stopPropagation();
        
        var tourId = FlowRouter.getParam("tourId");
        
        var target = event.target;
        var scheduleId = "";
        var paymentMethod = "";
        
        var strMsg = "";
        var hasError = false;
        
        if(Meteor.user()!==null){
            
            if(target.noOfGuest.value == ""){
                hasError = true;
                strMsg += "Please select no. of guest.<br>";
            }

            if(template.find('input:radio[name=tourDate]:checked') == null){
                hasError = true;
                strMsg += "Please select a tour date.<br>";
            }else{
                scheduleId = template.find('input:radio[name=tourDate]:checked').value;
            }

            if(template.find('input:radio[name=paymentMethod]:checked') == null){
                hasError = true;
                strMsg += "Please select a payment method.<br>";
            }else{
                paymentMethod = template.find('input:radio[name=paymentMethod]:checked').value;
            }

            if(hasError){
                Bert.alert(strMsg, 'danger', 'growl-top-right', 'fa-exclamation-triangle' );
            }else{
                
                var buddy = Buddies.find({ userId: Meteor.userId() }).fetch()[0];
                
                var data = {
                    buddy_id: buddy._id,
                    tour_id: tourId,
                    guests: parseInt(target.noOfGuest.value),
                    schedule_id: scheduleId,
                    payment_method: paymentMethod,
                    status: "Waiting for user confirmation",
                    create_at: new Date()
                };

                Meteor.call("createBooking", data, function(error, response){
                    if (error) {
                        console.log(error);
                        Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                    } else {
                        if(response != ""){
                            FlowRouter.go('/confirmation/'+response);
                        }else{
                            Bert.alert("Error creating booking.", 'danger', 'fixed-top', 'fa-frown-o');
                        }
                    }
                });
                
                
                //;
            }
            
        }else{
            Bert.alert("Please log in to book a tour.", 'danger', 'fixed-top', 'fa-exclamation-triangle' );
        }
        
        
        return false;
    }
});


Template.tourdetails.helpers({
    tourdetails(){
        const instance = Template.instance();
        
        //console.log(instance.tourdetails.get());
        
        return instance.tourdetails.get();
    },
    noOfGuest(){
        
        const instance = Template.instance();
        
        if(typeof instance.numOfGuests.get() != "number"){
            instance.numOfGuests.set(5);
        }
        
        return _.map(_.range(1, instance.numOfGuests.get()), function(idx) {
            return {val: idx };
        });
    },
    paymentMethods(){
        return Meteor.static.payment;
    },
    hasPhotos(tourdetails){
        
        if(typeof tourdetails.photos !== "undefined" && tourdetails.photos.length >0){
            return true;
        }else{
            return false;
        }
    }
});