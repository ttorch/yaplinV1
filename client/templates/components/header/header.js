Template.header.onCreated(function() {
    var googleFont = {rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"};
    DocHead.addLink(googleFont);
})

Template.header.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
});