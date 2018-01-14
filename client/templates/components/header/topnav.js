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