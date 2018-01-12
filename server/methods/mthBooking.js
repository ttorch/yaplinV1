import { Bookings } from '../../imports/collections/bookingsCol.js';

Meteor.methods({
    createBooking: function(data) {
        try {
            
            var bookingId = Bookings.insert(data);
            console.log("Create: OK");
            return bookingId;
        } catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error(error);
        }
    },
    getBookingDetails : function(data){
        
        try{
            const bookings = Bookings.find({"_id": data.booking_id}).fetch();
            
            return bookings[0];
            
        }catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    },
});