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
                        
                        Meteor.call("getTourDetails", tour_data, function(error, response){
                            
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
            
    //Session.set("refreshTourListings", true);
    
    /*Tracker.autorun(() => {
        console.log("tracker");
        if(Session.get("refreshTourListings") == true){
            Meteor.call("getABuddy", data, function(error, response){
                if(response){

                    var buddy = response;

                    var tour_data = {
                        "buddy_id": buddy._id
                    };

                    //retrieve tour by buddy_id
                    Meteor.call("getTourByBuddy", tour_data, function(error, response){
                        if(response){
                            instance.listings.set(response);
                        }else{
                            Bert.alert("Error retrieving listings", 'danger', 'fixed-top', 'fa-frown-o');
                        }
                    });
                }else{
                    Bert.alert("Error retrieving buddy details", 'danger', 'fixed-top', 'fa-frown-o');
                }
            });
            
            Session.set("refreshTourListings", false);
        }
    });*/

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
    }
});

Template.bookings.events({
   'click [id^=delete_]': function(event, tmpl) {
        
        var target = event.currentTarget;
        
        Session.set("showDelete",true);
        $("#confirmationWindow").modal('show');
        
        var listingId = target.id.replace("delete_","");
        
        Session.set("listingId",listingId);
        
        //console.log(target.id);
    }
});

Template.registerHelper('arrayify_bookings',function(obj){
    var result = [];
    
    if(typeof obj !== "undefined"){
        
        Object.keys(obj).forEach(function (key){
                console.log(obj[key]["tourdetails"]);
                result.push({
                    _id: obj[key]["booking"]["_id"],
                    title: obj[key]["tourdetails"][0]["title"],
                    date_from: obj[key]["tourdetails"][0]["schedules"]["from"],
                    date_to: obj[key]["tourdetails"][0]["schedules"]["to"],
                    payment_method: obj[key]["booking"]["payment_method"],
                    guests: obj[key]["booking"]["guests"],
                    price: obj[key]["tourdetails"][0]["price"],
                    status: obj[key]["booking"]["status"],
                });
        });
    }
    
    
    return result;
});