Template.delete.events({
    'click #btnDelete': function(event, tmpl) {
        
        Session.set("refreshTourListings", false);
        
        if(typeof Session.get("listingId") !== "undefined"){
            
            var data = {
                "_id": Session.get("listingId")
            };
    
            Meteor.call("DeleteTour", data ,function(error, response){
                $("#confirmationWindow").modal("hide");
                if(response){
                    Session.set("refreshTourListings", true);
                    Bert.alert("Tour listing deleted successfully!", 'success', 'fixed-top', 'fa-smile-o');
                    
                }else{
                    Bert.alert("Error deleting tour listing.", 'danger', 'fixed-top', 'fa-frown-o');
                }
            });
        }
    } 
});