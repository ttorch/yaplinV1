Template.bookings.onCreated(function(){
    
    var self = this;

    var title = "Yaplin - My Bookings";
    DocHead.setTitle(title);
   
    self.bookings = new ReactiveVar({});
    self.tourdetails = new ReactiveVar({});
     
});

Template.bookings.onRendered(function(){
    
    if(!Meteor.userId()){
        FlowRouter.go("/");
    }
    
    const instance = Template.instance();
    
    Session.set("refreshBookings", true);
    
    Tracker.autorun(() => {
        
        if(Session.get("refreshBookings") == true){
            var data = {
                "userId": Meteor.userId()
            };

            Meteor.call("getABuddy", data, function(error, response){

                if(response){

                    var buddy = response;

                    var booking_data = {
                        "buddy_id": buddy._id
                    };

                    //retrieve tour by buddy_id
                    Meteor.call("getBookings", booking_data, function(error, response){
                        if(response){

                            var aryTour = [];

                            var bookings = response;

                            Object.keys(bookings).forEach(function (key){

                                var tour_data = {
                                    "tour_id": bookings[key]["tour_id"],
                                    "schedule_id": bookings[key]["schedule_id"]
                                };

                                Meteor.call("getAccTourDetails", tour_data, function(error, response){

                                    if(response){
                                        aryTour.push({"booking": bookings[key], "tourdetails": response});

                                        instance.bookings.set(aryTour);
                                    }else{
                                        Bert.alert("Error retrieving tour details", 'danger', 'fixed-top', 'fa-frown-o');
                                    }
                                });

                            });

                        }else{
                            Bert.alert("Error retrieving bookings", 'danger', 'fixed-top', 'fa-frown-o');
                        }
                    });
                }else{
                    Bert.alert("Error retrieving buddy details", 'danger', 'fixed-top', 'fa-frown-o');
                }
            });
        }
        
        Session.set("refreshBookings", false);
    });
    
});

Template.bookings.helpers({
    bookings(){
        const instance = Template.instance();
        return instance.bookings.get();
    },
    totalCost(price, noOfGuests){
        
        return parseFloat(price*noOfGuests).toFixed(2);
    },
    action(){
        return Session.get("action");
    },
    showFeedback(status, paymentMode){
        
        if(status == "Accepted" && paymentMode == "cash"){
            return true;
        }else if(status == "Payment successful" && paymentMode == "paypal"){
            return true;
        }else{
            return false;
        }
    },
    showPayment(status, paymentMode){
        
        if(status == "Pending for payment" && paymentMode == "paypal"){
            return true;
        }else{
            return false;
        }
    }
});

Template.bookings.events({
   'click [id^=btnFeedback_]': function(event, tmpl) {
        
        var target = event.currentTarget;
        
        Session.set("showFeedback",true);
        Session.set('showDelete', false);
        
        var bookingId = target.id.replace("btnFeedback_","");
        
        Session.set("bookingId",bookingId);
        
        //console.log(target.id);
    }
});

Template.registerHelper('arrayify_bookings',function(obj){
    var result = [];
    
    if(typeof obj !== "undefined"){
        
        Object.keys(obj).forEach(function (key){
                
                if(typeof obj[key]["tourdetails"][0] !== "undefined"){
                    result.push({
                        _id: obj[key]["booking"]["_id"],
                        buddy_id: obj[key]["booking"]["buddy_id"],
                        title: obj[key]["tourdetails"][0]["title"],
                        date_from: obj[key]["tourdetails"][0]["schedules"]["from"],
                        date_to: obj[key]["tourdetails"][0]["schedules"]["to"],
                        payment_method: obj[key]["booking"]["payment_method"],
                        guests: obj[key]["booking"]["guests"],
                        price: obj[key]["tourdetails"][0]["price"],
                        status: obj[key]["booking"]["status"],
                    });
                }
        });
    }
    
    
    return result;
});