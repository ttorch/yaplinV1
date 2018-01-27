import { Buddies } from '../../../imports/collections/buddiesCol.js';
import { HTTP } from 'meteor/http';

Template.paypal.onCreated(function(){
    var self = this;
    
    self.bookingdetails = new ReactiveVar({});
    self.tourdetails = new ReactiveVar({});
    self.userdetails = new ReactiveVar({});
});

Template.paypal.onRendered(function(){
    
    const instance = Template.instance();
    
    Meteor.subscribe("userList");
    
    var isAuthorized = true;
   
    
        
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
                
                if(Meteor.userId()!== null){
                    
                    var userdetails = Meteor.users.find({_id: buddydetails.userId}).fetch()[0];

                    instance.userdetails.set(userdetails);
                
                
                    if(Meteor.userId() !== userdetails._id){
                        isAuthorized = false;
                    }
                }else{
                    isAuthorized = false;
                }
                
                if(isAuthorized == false){
                    Bert.alert("Sorry, you are not authorized to make payment. Please login to make payment", 'danger', 'fixed-top', 'fa-frown-o');
                    FlowRouter.go("/");
                }
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

Template.paypal.events({
   "submit form": function(event, template){
       
       event.preventDefault();
       event.stopPropagation();
        
       var target = event.target;
       
       var paypal_data= {
           "business": target.business.value,
           "item_name": target.item_name.value,
           "quantity": target.quantity.value,
           "amount": target.amount.value,
           "currency_code": target.currency_code.value,
           "shipping": target.shipping.value,
           "tax": target.tax.value,
           "notify_url": target.notify_url.value,
           "return": target.return.value,
           "cancel_return": target.cancel_return.value,
           "env": target.env.value,
           "cmd": target.cmd.value,
           "bn": target.bn.value,
           "button": target.button.value,
       };
       
       
       Meteor.Paypal.payment({
        "intent": 'sale',
        "payer": {
            "payment_method": "paypal"
        },
        "transactions": [
        {
        name: 'Buster Bluth',
        number: '4111111111111111',
        type: 'visa',
        cvv2: '123',
        expire_year: '2015',
        expire_month: '01'
      }],
      {
        total: '100.10',
        currency: 'USD'
      },
      function(error, results){
        if(error)
          //Deal with Error
        else
          //results contains:
          //  saved (true or false)
          //  if false: "error" contains the reasons for failure
          //  if true: "payment" contains the transaction information
      });

       return false;
   },
});


