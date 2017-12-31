import './toursearchfilter.html';

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
    
    var date="";
    
    if($("#date").val()!=""){
        date=moment($("#date").val()).format("YYYY-MM-DD");
    }
    
    var timeFrom=$("#timeFrom").val();
    var timeTo=$("#timeTo").val();
    var noOfGuest=$("#noOfGuest").val();
    
    Session.set("dateFilter",date);
    Session.set("timeFromFilter",timeFrom);
    Session.set("timeToFilter",timeTo);
    Session.set("noOfGuestFilter",noOfGuest);
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
        
        Session.set("tours",null);
        if (error) {
            console.log(error);
            Bart.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            Session.set("tours",response);
        }
    });
    return false;
    
  },
});


