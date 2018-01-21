import { Buddies } from '../../../imports/collections/buddiesCol.js';

Template.paypal.onCreated(function(){
    var self = this;
    
    self.bookingdetails = new ReactiveVar({});
    self.tourdetails = new ReactiveVar({});
    self.userdetails = new ReactiveVar({});
});

Template.paypal.onRendered(function(){
    
    const instance = Template.instance();
    
    var data = {
        booking_id: FlowRouter.getParam("bookingId"),
    };
    
    Meteor.call("getBookingDetails",data,function(error,response){
        
        if (error) {
            console.log(error);
            Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            instance.bookingdetails.set(response);
            
            var tour_data = {
                "tour_id":instance.bookingdetails.get().tour_id
            };
            
            Meteor.call("getTourDetails",tour_data, function(error, response){
                if (error) {
                    console.log(error);
                    Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                } else {
                    instance.tourdetails.set(response);
                }
                
            });
            
            //get info of the person who booked this tour
            var buddydetails = Buddies.find({ _id: instance.bookingdetails.get().buddy_id }).fetch()[0];

            var userdetails = Meteor.users.find({_id: buddydetails.userId}).fetch()[0];
            
            instance.userdetails.set(userdetails);
            
        }
    });
});

Template.paypal.helpers({
    bookingdetails(){
        const instance = Template.instance();
        
        return instance.bookingdetails.get();
    },
    tourdetails(){
        const instance = Template.instance();
        
        return instance.tourdetails.get();
    },
    userdetails(){
        const instance = Template.instance();
        
        return instance.userdetails.get();
    },
    totalCost(price, noOfGuests){
        
        return parseFloat(price*noOfGuests).toFixed(2);
    },
});


