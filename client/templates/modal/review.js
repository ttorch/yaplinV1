Template.review.events({
    'click #btnSubmit': function(event, tmpl) {
        
        Session.set("refreshBookings", false);
        
        if(typeof Session.get("bookingId") !== "undefined"){
            
            var feedback = $("#txtFeedback").val();
            var rating = $('#rating').data('userrating');
            var reviews = [];
            
            reviews.push({
                "review_id": new Meteor.Collection.ObjectID()._str, 
                "rating":rating,
                "feedback": feedback
            });
            
            var booking_data = {
                "booking_id": Session.get("bookingId"),
            };
            
            //get booking details
            Meteor.call("getBookingDetails", booking_data, function(error, response){
                
                if(response){
                    
                    var data = {
                        "_id": response.buddy_id,
                        "reviews": reviews,
                    };
                    
                    //insert review into buddies
                    Meteor.call("UpdateBuddy", data ,function(error, response){

                        $("#confirmationWindow").modal("hide");

                        if(response == 1){
                            
                            var status = {
                                "booking_id": Session.get("bookingId"),
                                "status": "Complete"
                            };
                            
                            //update booking status to complete
                            Meteor.call("updateBooking", status ,function(error, response){
                                
                                if(response){
                                    Session.set("refreshBookings", true);
                                    Bert.alert("Thanks for your feedback!", 'success', 'fixed-top', 'fa-smile-o');
                                }else{
                                    Bert.alert("Error updating booking status.", 'danger', 'fixed-top', 'fa-frown-o');
                                }
                            });

                        }else{
                            Bert.alert("Error writing feedback.", 'danger', 'fixed-top', 'fa-frown-o');
                        }
                    });
                }else{
                    Bert.alert("Error retrieving booking details.", 'danger', 'fixed-top', 'fa-frown-o');
                }
            });
            
            
        }
    } 
});