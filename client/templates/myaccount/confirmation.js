import { Buddies } from '../../../imports/collections/buddiesCol.js';

Template.buddyconfirmation.onCreated(function(){
    
    var self = this;
    self.tourdetails = new ReactiveVar({});
    self.bookingdetails = new ReactiveVar({});
    self.maxNumOfGuests = new ReactiveVar({});
    
    var title = "Yaplin - Booking Confirmation";
    DocHead.setTitle(title);
   
});

Template.buddyconfirmation.onRendered(function(){
   
   Meteor.subscribe("userList");
   
   var isAuthorized = true;
   
   const instance = Template.instance();
   
   var bookingId = FlowRouter.getParam("bookingId");
    
    var data = {
        "booking_id":bookingId
    };
    
    var status = FlowRouter.getQueryParam("status");
    
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
                    
                    var tourdetails = instance.tourdetails.get();
                            
                    var buddydetails = Buddies.find({ _id: tourdetails.buddy_id }).fetch()[0];
   
                    var userdetails = Meteor.users.find({_id: buddydetails.userId}).fetch()[0];
                    
                    //if user is logged in
                    if(Meteor.userId()!== null){
                        
                        //if logged in id same as tour user id
                        if(Meteor.userId() !== userdetails._id){

                            isAuthorized = false;
                        }
                    }else{
                        //if user is not log in
                        isAuthorized = false;
                    }
                    
                    if(!isAuthorized){
                        Bert.alert("Sorry, you are not authorize to view the booking details.", 'danger', 'fixed-top', 'fa-frown-o');

                        FlowRouter.go("/");
                    }
                }
            });
        }
    });
    
});

Template.buddyconfirmation.events({
    'click #accept': function(event){
        
        event.preventDefault();
        event.stopPropagation();
        
        const instance = Template.instance();
        
        var tourdetails = instance.tourdetails.get();
        var bookingdetails = instance.bookingdetails.get();
        
        var data = {
            "_id": tourdetails._id
        };
        
        //retrieve num of guest allowed in a booking
        Meteor.call("getNumGuest",data,function(error,response){
            if (error) {
                console.log(error);
                Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
            } else {
                
                instance.maxNumOfGuests.set(response);
                
                var booking_data = {
                    "tour_id": bookingdetails.tour_id,
                    "schedule_id": bookingdetails.schedule_id,
                    "status": "Accepted"
                };
                
                //retrieve total number of accepted bookings
                
                Meteor.call("getNumOfAcceptedBookings",booking_data,function(error,response){
                    if (error) {
                        console.log(error);
                        Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                    } else {

                        var totalNumOfGuests = response;
                        var balance = instance.maxNumOfGuests.get() - totalNumOfGuests;
                        
                        //if num of guest accepted is more than or equal to max guest allow
                        if(totalNumOfGuests >= instance.maxNumOfGuests.get()){
                            
                            //show error
                            Bert.alert("Sorry, you have reached max no. of guest allowed.", 'danger', 'fixed-top', 'fa-frown-o');
                            
                        }else if(bookingdetails.guests > balance){
                            
                            //if accept current booking, the total number is above max guest allowed
                            Bert.alert("Sorry, you can only accept "+ balance+ " more guest(s).", 'danger', 'fixed-top', 'fa-frown-o');
                        }else{
                            
                            var status="Accepted";
                            
                            if(bookingdetails.payment_method == "paypal"){
                                status = "Pending for payment";
                            }
                            
                            var booking_data = {
                                "booking_id": FlowRouter.getParam("bookingId"),
                                "status": status
                            };
                
                            //accept booking
                            Meteor.call("updateBooking",booking_data, function(error, response){
                                if (error) {
                                    console.log(error);
                                    Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                                } else {
                                    
                                    //notify user, redirect to dashboard
                                    if(response > 0){
                                        
                                        //get info of the person who booked this tour
                                        var buddydetails = Buddies.find({ _id: bookingdetails.buddy_id }).fetch()[0];
                                        
                                        var userdetails = Meteor.users.find({_id: buddydetails.userId}).fetch()[0];
                                        
                                        let html = 'Hi ' + userdetails.profile.firstName + ',<br>';
                                        html += '<p>Your booking no '+ bookingdetails._id +' has been accepted.</p>';
                                        
                                        if(bookingdetails.payment_method == "paypal"){
                                            html+="<p>Please make payment <a href='"+Meteor.absoluteUrl()+"payment/"+bookingdetails._id+"'>here</a>.</p>";
                                        }else{
                                            html += '<p>Please remember to make your payment on the day of your booking.</p>';
                                            html += '<p>Login to your account at '+Meteor.absoluteUrl()+' to view it.</p>';
                                        }

                                        Meteor.call('SendEmail',
                                            userdetails.emails[0].address,
                                            'Admin <sixe.eeeeee@gmail.com>',
                                            'Hello from Yaplin! Your booking no '+ bookingdetails._id +' has been accepted!',
                                            html, function(error, response){
                                                if (error) {
                                                    console.log("SEND EMAIL ERROR CHILD: ", error);
                                                    Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                                                    throw error; //new Meteor.Error('500','Oops! Something went wrong when sending email.');                 
                                                } else {
                                                    Bert.alert("You have successfully accepted the booking.", 'success', 'fixed-top', 'fa-smile-o');
                                                    FlowRouter.go("/myaccount/profile");
                                                }
                                            }
                                        );
                                        
                                    }else{
                                        Bert.alert("Error, accepting the booking. Please contact the administrator.", 'danger', 'fixed-top', 'fa-frown-o');
                                    }
                                    
                                }
                            });
                            
                        }
                    }
                });
            }
        });
        
        return false;
    },
    'click #reject': function(event){
        
        event.preventDefault();
        event.stopPropagation();
        
        console.log("reject");
        return false;
    },
});


Template.buddyconfirmation.helpers({
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