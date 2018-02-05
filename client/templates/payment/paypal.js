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
            
            if(instance.bookingdetails.get().status.toLowerCase() == "payment successful"){
                Bert.alert("You have paid for the booking.", 'danger', 'fixed-top', 'fa-frown-o');
                FlowRouter.go("/");
            }
            
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
    
    
    $('#paypal-payment-form').validate({
        rules: {
            name: {
                required: true,
            },
           card_type: {
                required: true,
            },
            card_number:{
                required: true,
                minlength: 16,
                digits: true,
            },
            expire_month: {
                required: true,
            },
            expire_year: {
                required: true,
            },
            cvv: {
                required: true,
                minlength: 3,
                maxlength: 3,
                digits: true
            },

        },
        messages: {
            name: {
                required: 'Name is required.',
            },
            card_type: {
                required: 'Card type is required.',
            },
            card_number: {
                required: 'Card Number is required.',
                minlength: 'Card Number requires minimum 16 digits.',
                digits: 'Please enter only numbers in card number field.',
            },
            expire_month: {
                required: 'Expiration Month is required.',
            },
            expire_year: {
                required: 'Expiration Year is required.',
            },
            cvv: {
                required: 'CVV Year is required.',
                minlength: 'CVV requires minimum 3 digits.',
                maxlength: 'CVV requires maximum 3 digits.',
                digits: 'Please enter only numbers in CVV field.'
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
    cardExpireYear(){
        var currentYear = moment().format("YYYY");
        var endYear = moment().add(5, 'years').format("YYYY");
        
        aryYear = new Array();
        
        for(var i = currentYear; i<=endYear; i++){
            aryYear.push({val:i}); 
        }
        
        return aryYear;
    }
});

Template.paypal.events({
   "submit form": function(event, template){
       
       event.preventDefault();
       event.stopPropagation();
        
       var target = event.target;
       
       var paypal_data= Template.paypalCreditCardForm.card_data();
       
       const instance = Template.instance();
       
       var tourdetails = instance.tourdetails.get();
       var bookingdetails = instance.bookingdetails.get();
       
       var totalCost = parseFloat(tourdetails.price*bookingdetails.guests).toFixed(2)
       
       
       Meteor.Paypal.purchase(paypal_data,
      {
        total: totalCost,
        currency: 'SGD'
      },
      function(error, results){
        
        var data = {
            "booking_id": bookingdetails._id,
        };
          
        if(error){
          data.status = "Payment failed";
          
        }else{
          
          if(results.saved == false){
                data.payment_details = results.error.response.details;
                data.status = "Payment failed";
                
           }else{
               data.payment_details = {
                   "paypal_id": results.payment.id,
                   "intent": results.payment.intent,
                   "transactions": {
                       "amount": results.payment.transactions[0].amount.total,
                       "currency": results.payment.transactions[0].amount.currency,
                   },
                   "update_time": results.payment.update_time
               };
               
               data.status = "Payment successful";
           }
           
          //update payment details into database
          Meteor.call("updateBooking", data, function(error,response){
              
              if(error){
                  Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
              }else{
                  FlowRouter.go("/payment/thankyou");
              }
          });
          
        }
        
      });

       return false;
   },
});


