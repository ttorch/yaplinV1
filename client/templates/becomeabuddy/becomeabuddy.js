Template.becomeabuddy.onCreated(function() {
    document.title = "Yaplin - Become a buddy";
    FlowRouter.subsReady("subsBuddies", function() {
        // Bart.alert('SUBSCRIPTION IS OK', 'success', 'growl-top-right', 'fa-frown-o');
        console.log('SUBSCRIPTION IS OK');
    });
});

Template.becomeabuddy.rendered = function(){
    var element = $("#all-con");

    if(!element.hasClass("become-buddy")){
        element.addClass("become-buddy"); 
    }
    
}
