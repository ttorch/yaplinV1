Template.findbuddy.onCreated(function(){
    var title = "Yaplin - Find Buddy";
    DocHead.setTitle(title);
    
});

Template.findbuddy.onRendered(function(){
    
    var today = moment().format("DD MMM YYYY");
    var timenow = moment().format("HH:mm");
    
    var data = {
        date: today,
        timeFrom: timenow,
    };
    
    Meteor.call("SearchTour",data,function(error,response){
        
        if (error) {
            console.log(error);
            Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            Session.set("tours",response);
        }
    });
});

Template.findbuddy.helpers({
  tours() {
      return Session.get("tours");
  },
});

Template.findbuddy.events({
  'submit .tourFilterFrm'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    event.stopPropagation();
    
    var target = event.target;
    
    // Get value from form element
    var data = {
        title: target.title.value,
    };
    
    //search tours
    Meteor.call('SearchTour', data, function(error, response){
        
        if (error) {
            console.log(error);
            Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            Session.set("tours",response);
        }
    });
    
    return false;
    
  },
});