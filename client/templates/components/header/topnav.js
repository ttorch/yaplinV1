Template.topnav.rendered = function(){
    var element = $("#all-con");

    if(!element.hasClass("become-buddy")){
        element.addClass("become-buddy"); 
    }
    var currentLocation = window.location;
    console.log("TOP NAV " + currentLocation );
}