Template.addtour.onCreated(function() {
    document.title = "Yaplin - Add Tours";
});

Template.addtour.events({
    'submit form': function(event){
        event.preventDefault();
        event.stopPropagation();
        var target = event.target;
        var data = {
            title: target.title.value,
            location: target.location.value
        }

        Meteor.call('CreateTour', data, function(error, response){
            
            if (error) {
                console.log(error);
                Bart.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
            } else {
                console.log(response);
            }
        });
        return false;
    }
})