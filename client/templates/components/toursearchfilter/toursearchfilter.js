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
});

Template.toursearchfilter.helpers({
  noOfGuest(){
      return _.map(_.range(1, 6), function(idx) {
        return {val: idx };
    })
  }
});


