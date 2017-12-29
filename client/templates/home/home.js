Template.home.onCreated(function(){
    var title = "Yaplin - Home";
    DocHead.setTitle(title);
    
    var data = {
        date: $("#date").val(),
        noOfGuest: $("#noOfGuests").val(),
        timeFrom: $("#timeFrom").val(),
        timeTo: $("#timeTo").val()
    };
    
    var self = this;
    
    self.tours = new ReactiveVar({});
    
    Meteor.call("SearchTour",{},function(error,response){
        
        if (error) {
            console.log(error);
            Bart.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
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
        obj.forEach(function(obj,i){
            
            result.push({
                _id: obj._id,
                title: obj.title,
                location: obj.location,
                guests:obj.guests,
                price:obj.price,
                summary:obj.summary,
                experience:obj.experience,
                exp_expectation:obj.exp_expectation,
                provision:obj.provision,
                prov_expectation:obj.prov_expectation,
                scheduleId: obj.schedules.scheduleId,
                from: obj.schedules.from,
                to: obj.schedules.to,
            });

        });
        
        console.log(result);
    }
    
    
    return result;
});