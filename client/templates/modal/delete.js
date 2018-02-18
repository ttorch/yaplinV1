Template.delete.events({
    'click #btnDelete': function(event, tmpl) {
        
        if(typeof Session.get("listingId") !== "undefined"){
            
            Meteor.call("", function(){
                
            })
        }
        
        
    } 
});