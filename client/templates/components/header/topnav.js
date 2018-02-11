Template.topnav.rendered = function(){
    var element = $("#all-con");

    // if(element.hasClass("become-buddy")){
    //     element.removeClass("become-buddy"); 
    // }
}

Template.topnav.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        
        if(FlowRouter.current().path.indexOf("/myaccount/")>=0){
            //redirect to homepage
            FlowRouter.go("/");
        }
        
    }
});

Template.topnav.helpers({
    isHome(){
        if (FlowRouter.current().path == "/"){
            return true;
        }else{
            return false;
        }
    },
});