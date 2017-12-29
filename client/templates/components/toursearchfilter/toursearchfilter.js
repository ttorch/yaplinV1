import './toursearchfilter.html';

Template.toursearchfilter.created = function () {
    
    //We set default value
    this.date = new ReactiveVar($("#date").val());
    
};
  
Template.toursearchfilter.onRendered(function(){
    
    $('.datepicker').datetimepicker({
        format: 'DD MMM YYYY',
        date: new Date()
    });
    
    $('.timepicker').datetimepicker({
        format: 'HH:mm',
        date: new Date(),
        stepping:30
    });
    
    console.log($("#date").val()+ " here");
});

Template.toursearchfilter.helpers({
  noOfGuest(){
      return _.map(_.range(1, 6), function(idx) {
        return {val: idx };
    })
  }
});

Template.toursearchfilter.events({
  'submit .tourFilterFrm'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    event.stopPropagation();
 
    var target = event.target;
    
    // Get value from form element
    var data = {
        date: target.date.value,
        noOfGuest: target.noOfGuest.value,
        timeFrom: target.timeFrom.value,
        timeTo: target.timeTo.value
    };
    
    //search tours
    Meteor.call('SearchTour', data, function(error, response){
        
        if (error) {
            console.log(error);
            Bart.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            console.log(response);
        }
    });
    return false;
    
  },
});


