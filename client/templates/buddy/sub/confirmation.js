Template.confirmation.onCreated(function(){
    
    var self = this;
    self.tourdetails = new ReactiveVar({});
    self.bookingdetails = new ReactiveVar({});
    
    var title = "Yaplin - Booking Confirmation";
    DocHead.setTitle(title);
   
});

Template.confirmation.onRendered(function(){
   
    const instance = Template.instance();
   
   var bookingId = FlowRouter.getParam("bookingId");
    
    var data = {
        "booking_id":bookingId
    };
    
    Meteor.call("getBookingDetails",data,function(error,response){
        
        if (error) {
            console.log(error);
            Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            instance.bookingdetails.set(response);
            
            var tour_data={
                "tour_id": response.tour_id
            };
            
            Meteor.call("getTourDetails",tour_data,function(error,response){
        
                if (error) {
                    console.log(error);
                    Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                } else {
                    //console.log(response);
                    instance.tourdetails.set(response);

                }
            });
        }
    });
    
});

Template.confirmation.events({
    'submit [name=confirmationFrm]': function(event){
        event.preventDefault();
        event.stopPropagation();
        
        if(Meteor.user()){
            const instance = Template.instance();
            
            var bookingdetails = instance.bookingdetails.get();
            
            console.log(bookingdetails.payment_method);
        }else{
            Bert.alert("Please log in to confirm your booking.", 'danger', 'fixed-top', 'fa-exclamation-triangle' );
        }
        
        
        return false;
    }
});


Template.confirmation.helpers({
    tourdetails(){
        const instance = Template.instance();
        
        return instance.tourdetails.get();
    },
    bookingdetails(){
        const instance = Template.instance();
        
        return instance.bookingdetails.get();
    },
    capitalize(str){
        
        if(typeof str === "string"){
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                // You do not need to check if i is larger than splitStr length, as your for does that for you
                // Assign it back to the array
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
            }
            
            // Directly return the joined string
            return splitStr.join(' ');
        }else{
            return "";
        }
        
    },
    totalCost(price, noOfGuests){
        
        return parseFloat(price*noOfGuests).toFixed(2);
    },
    hasPhotos(tourdetails){
        
        if(typeof tourdetails.photos !== "undefined" && tourdetails.photos.length >0){
            return true;
        }else{
            return false;
        }
    },
    selectedSchedule(scheduleId){
        const instance = Template.instance();
        
        var bookingdetails = instance.bookingdetails.get();
        
        if(scheduleId == bookingdetails.schedule_id){
            return true;
        }else{
            return false;
        }
    },
    isPaypal(){
        
    }
});