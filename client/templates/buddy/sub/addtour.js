noOfGuests = 1;

Template.addtour.onCreated(function() {
    document.title = "Yaplin - Create Tour";
    Session.set('schedules', []);
    
    var schedules = Session.get('schedules');
    var uniqid = Math.floor(Math.random() * 100000);
    schedules.push({uniqid: uniqid, from: "", to: ""});
    Session.set('schedules', schedules);
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

    "click .add-sched": function(event) {
        var schedules = Session.get('schedules');
        var uniqid = Math.floor(Math.random() * 100000);
        schedules.push({uniqid: uniqid, from: "", to: ""});
        Session.set('schedules', schedules);

        $('#schedules').append('<tr id="row-' + uniqid +'"><td><div class="form-group"><div class="input-group date start" id="start-' + uniqid + '"><input type="text" class="form-control form-control-lg" placeholder="From"/> \
                    <span class="input-group-addon"> \
                        <span class="glyphicon glyphicon-calendar"></span> \
                    </span> \
                </div> \
            </div> \
        </td> \
        <td> \
            <div class="form-group"> \
                <div class="input-group date end" id="end-' + uniqid + '"> \
                    <input type="text" class="form-control form-control-lg" placeholder="To"/> \
                    <span class="input-group-addon"> \
                        <span class="glyphicon glyphicon-calendar"></span> \
                    </span> \
                </div> \
            </div> \
        </td> \
        <td><button type="button" class="btn btn-success add-sched" data-toggle="tooltip" title="Add schedule"> \
                + \
            </button> <button name="' + uniqid +'" type="button" class="btn btn-danger remove-sched" data-toggle="tooltip" title="Remove schedule"> \
            -</button></td> \
        </tr>');
        $('#start-'+uniqid).datetimepicker();
        $('#end-'+uniqid).datetimepicker();
        console.log(Session.get('schedules'));
    },

    "click .remove-sched": function(event) {
        var buttonName = event.target.name;
        // TODO: Remove the deleted row from the Session
        // console.log(Session.key[uniqid]);

        // delete Session.value[buttonName];
        $('table#schedules tr#row-' + buttonName).remove();
    }
});

Template.addtour.helpers({
    participants: function(){
        return [1, 2, 3, 4, 5];
    },

    schedules: function() {
        return Session.get('schedules');
    }
});