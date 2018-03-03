Template.memberprofile.onCreated(function(){
    
    var self = this;

    var title = "Yaplin - Buddy Profile";
    DocHead.setTitle(title);
   
    self.buddydetails = new ReactiveVar({});
    self.reviews = new ReactiveVar({});
     
});

Template.memberprofile.onRendered(function(){
    
    const instance = Template.instance();
    
    
    var data = {
        "buddy_id": FlowRouter.getParam("buddyId")
    };
    
    Meteor.call("getABuddy", data, function(error, response){
        if(response){

            var buddy = response;
            
            instance.reviews.set(buddy.reviews);
            
            var user_data = {
                "_id": buddy.userId
            };
            
            Meteor.call("getAUser", user_data, function(error, response){
                
                if(response){
                    instance.buddydetails.set(response);
                }else{
                    Bert.alert("Error retrieving buddy details", 'danger', 'fixed-top', 'fa-frown-o');
                }
            });
            
        }else{
            Bert.alert("Error retrieving buddy details", 'danger', 'fixed-top', 'fa-frown-o');
        }
    });

});

Template.memberprofile.helpers({
    buddydetails: function(){
        const instance = Template.instance();
        
        return instance.buddydetails.get();
    },
    buddyemail: function(){
        
        const instance = Template.instance();
        
        var buddydetails = instance.buddydetails.get();
        
        if(typeof buddydetails.emails !== "undefined"){
            return buddydetails.emails[0].address;
        }else{
            return "";
        }
    },
    reviews:function(){
        const instance = Template.instance();
        
        return instance.reviews.get();
    }
});

Template.registerHelper('arrayify_reviews',function(obj){
    var result = [];
    
    if(typeof obj !== "undefined"){
        
        Object.keys(obj).forEach(function (key){
                
                result.push({
                    review_id: obj[key]["review_id"],
                    rating: obj[key]["rating"],
                    feedback: obj[key]["feedback"],
                    name: obj[key]["name"],
                });
        });
    }
    
    
    return result;
});