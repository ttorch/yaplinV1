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
        
        if (error) {
            console.log(error);
            Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            
            Session.set("tours",response);
            
            
            
              /*$(".regular").slick({
                      dots: false,
                      infinite: false,
                      slidesToShow: 4,
                      slidesToScroll: 4,
                      responsive: [
                      {
                        breakpoint: 1024,
                        settings: {
                          slidesToShow: 4,
                          slidesToScroll: 4,
                        }
                      },
                      {
                        breakpoint: 600,
                        settings: {
                          slidesToShow: 3,
                          slidesToScroll: 3
                        }
                      },
                      {
                        breakpoint: 480,
                        settings: {
                          slidesToShow: 2,
                          slidesToScroll: 2
                        }
                      }
                    ]
                  });

                $(".regular").slick("setPosition");*/
        }
    });
    
    return false;
    
  },
});


