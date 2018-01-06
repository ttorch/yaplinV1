Template.tourdetails.onCreated(function(){
    
    var self = this;
    self.tourdetails = new ReactiveVar({});
   
});

Template.tourdetails.onRendered(function(){
   $(window).scroll(function() {    
        var scroll = $(window).scrollTop();

        if (scroll >= 215) {

            $("#form-book").addClass("position-book");
        }else {

                $("#form-book").removeClass("position-book");
        }

    });

   const instance = Template.instance();
   
   var tourId = FlowRouter.getParam("tourId");
    
    var data = {
        "tour_id":tourId
    };
    
    Meteor.call("getTourDetails",data,function(error,response){
        
        if (error) {
            console.log(error);
            Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            instance.tourdetails.set(response);
        }
    });
    
});

Template.tourdetails.events({
    'submit form': function(event){
        event.preventDefault();
        event.stopPropagation();
        console.log(event);
        
        return false;
    }
});


Template.tourdetails.helpers({
    tourdetails(){
        const instance = Template.instance();
        
        //console.log(instance.tourdetails.get());
        
        return instance.tourdetails.get();
    },
    noOfGuest(){
        return _.map(_.range(1, 6), function(idx) {
          return {val: idx };
      })
    },
    paymentMethods(){
        return Meteor.static.payment;
    },
    hasPhotos(tourdetails){
        
        if(typeof tourdetails.photos !== "undefined" && tourdetails.photos.length >0){
            return true;
        }else{
            return false;
        }
    }
});