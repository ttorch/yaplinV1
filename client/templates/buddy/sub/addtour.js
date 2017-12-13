noOfGuests = 1;

Template.addtour.onCreated(function() {
    document.title = "Yaplin - Create Tour";
});

Template.addtour.rendered = function() {
    $('#start_01').datetimepicker();
    $('#end_01').datetimepicker();
};

Template.addtour.events({
    'submit form': function(event){
        event.preventDefault();
        event.stopPropagation();
        var target = event.target;
        var data = {
            title: target.title.value,
            location: target.location.value,
            guests: noOfGuests,
            price: target.price.value,
            summary: target.summary.value,
            experience: target.experience.value,
            exp_expectation: target.exp_expectation.value,
            provision: target.provision.value,
            prov_expectation: target.prov_expectation.value
        };

        Meteor.call('CreateTour', data, function(error, response){
            
            if (error) {
                console.log(error);
                Bart.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
            } else {
                console.log(response);
            }
        });
        return false;
    },

    "change #noOfGuests": function(event, template) {
        var participant = $(event.currentTarget).val();
        console.log("participant: " + participant);
        noOfGuests = participant;
    },

    "click #btnAddSched": function(event) {
        alert('Add schedule!');
    },

    "click #btnRemoveSched": function(event) {
        alert('Remove schedule!');
    }
});

Template.addtour.helpers({
    participants: function(){
        return [1, 2, 3, 4, 5];
    }
});