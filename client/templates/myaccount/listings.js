Template.listings.onCreated(function(){
    
    var self = this;
<<<<<<< HEAD
    self.tourdetails = new ReactiveVar({});
    
    var title = "Yaplin - My Listings";
    DocHead.setTitle(title);
   
=======
    self.listings = new ReactiveVar({});
     
});

Template.listings.onRendered(function(){
    
    if(!Meteor.userId()){
        FlowRouter.go("/");
    }
    
    const instance = Template.instance();
    
    
    var data = {
        "userId": Meteor.userId()
    };
    
    
    Meteor.call("getABuddy", data, function(error, response){
        if(response){
            
            var buddy = response;
            
            var tour_data = {
                "buddy_id": buddy._id
            };
            
            //retrieve tour by buddy_id
            Meteor.call("getTourByBuddy", tour_data, function(error, response){
                if(response){
                    instance.listings.set(response);
                }else{
                    Bert.alert("Error retrieving listings", 'danger', 'fixed-top', 'fa-frown-o');
                }
            });
        }else{
            Bert.alert("Error retrieving buddy details", 'danger', 'fixed-top', 'fa-frown-o');
        }
    });
});

Template.listings.helpers({
    listings(){
        const instance = Template.instance();
        return instance.listings.get();
    },
    action(){
        return Session.get("action");
    }
});

Template.registerHelper('arrayify_tour',function(obj){
    var result = [];
    
    if(typeof obj !== "undefined"){
        
        Object.keys(obj).forEach(function (key){
                
                result.push({
                    _id: obj[key]["_id"],
                    title: obj[key]["title"],
                    location: obj[key]["location"],
                    guests: obj[key]["guests"],
                    price: obj[key]["price"],
                    summary: obj[key]["summary"],
                    experience: obj[key]["experience"],
                    exp_expectation: obj[key]["exp_expectation"],
                    provision: obj[key]["provision"],
                    prov_expectation: obj[key]["prov_expectation"],
                    scheduleId: obj[key]["schedules"]["scheduleId"],
                    from: obj[key]["schedules"]["from"],
                    to: obj[key]["schedules"]["to"],
                });
        });
    }
    
    
    return result;
>>>>>>> tour-listing
});