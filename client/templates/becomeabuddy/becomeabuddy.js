Template.becomeabuddy.onCreated(function() {
    document.title = "Yaplin - Become a buddy";
});

Template.becomeabuddy.rendered = function(){
    var element = $("#all-con");

    if(!element.hasClass("become-buddy")){
        element.addClass("become-buddy"); 
    }
    
    $("#white-logo").removeClass('show-logo').addClass("hidden-logo"); 
    $("#orange-logo").removeClass('hidden-logo').addClass("show-logo");
}
