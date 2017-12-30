Template.home.onCreated(function(){
    var title = "Yaplin - Home";
    DocHead.setTitle(title);
    
    /*var data = {
        date: Session.get("dateFilter"),
        noOfGuest: Session.get("noOfGuestFilter"),
        timeFrom: Session.get("timeFromFilter"),
        timeTo: Session.get("timeToFilter")
    };*/
    
    var self = this;
    
    self.tours = new ReactiveVar({});
    
    Meteor.call("SearchTour",{},function(error,response){
        
        if (error) {
            console.log(error);
            Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            self.tours.set(response);
        }
    });
    
});

Template.home.helpers({
  tours() {
      return Template.instance().tours.get();
  },
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
});