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
    getNumOfAcceptedBookings: function(data){
        
        try{
            
            var pipeline = [];
            var num =0;
            
            pipeline.push({"$match": {"tour_id": data.tour_id, "schedule_id": data.schedule_id, "status": data.status}});
            
            pipeline.push({"$group": { "_id": null, "total": { "$sum": "$guests" }}});
            
            const result = Bookings.aggregate(pipeline);
            
            if(typeof result[0] !== "undefined"){
                num = result[0].total;
            }
            
            return num;
            
        }catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
        
    },
    updateBooking: function(data){
        try{
            
            var set = {};
            
            if(data.status != ""){
                set["status"] = data.status;
            }
            
            if(data.payment_details != ""){
                set["payment_details"] = data.payment_details;
            }
            
            const results = Bookings.update({"_id": data.booking_id},{"$set":set});
            
            return results;
            
        }catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    },
    getBookings: function(data) {
        
        try{
            const bookings = Bookings.find({"buddy_id": data.buddy_id}).fetch();
            
            return bookings;
            
        }catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    }
});