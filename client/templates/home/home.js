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
    
    self.tours = new ReactiveVar("");
    
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

Template.registerHelper('arrayify',function(obj){
    var result = [];
    
    obj.forEach(function(obj,i){
        result.push({
            _id: JSON.stringify(obj._id),
            title: obj.title,
            guests:obj.guests
        });
        
    });
    
    console.log(result);
    return result;
});