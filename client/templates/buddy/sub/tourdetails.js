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

Template.tourdetails.helpers({
    tourdetails(){
        const instance = Template.instance();
        
        instance.tourdetails.set({id:"123",title:"adsd"});
        
        return instance.tourdetails.get();
    }
});