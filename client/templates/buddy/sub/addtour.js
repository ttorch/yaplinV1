import { Buddies } from '../../../../imports/collections/buddiesCol.js';
noOfGuests = 1;
schedules = [];

function getDateTime() {
    var currentDateTime = new Date();
    return currentDateTime.getDate() + "/" + (currentDateTime.getMonth()+1)  + "/" + currentDateTime.getFullYear() + " " + currentDateTime.getHours() + ":" + currentDateTime.getMinutes();
}

Template.addtour.onCreated(function() {
    document.title = "Yaplin - Create Tour";
    Session.set('schedules', [{scheduleId: 1, from: getDateTime(), to: getDateTime()}]);
});

Template.addtour.events({
    'submit form': function(event){
        event.preventDefault();
        event.stopPropagation();
        var target = event.target;
        var buddy = Buddies.find({ userId: Meteor.userId() }).fetch()[0];
        if (buddy != undefined && buddy._id && buddy.verified === true) {
            var data = {
                buddy_id: buddy._id,
                title: target.title.value,
                location: target.location.value,
                guests: noOfGuests,
                price: target.price.value,
                summary: target.summary.value,
                experience: target.experience.value,
                exp_expectation: target.exp_expectation.value,
                provision: target.provision.value,
                prov_expectation: target.prov_expectation.value,
                schedules: Session.get('schedules')
            };
            console.log(data);
            Meteor.call('CreateTour', data, function(error, response){
                
                if (error) {
                    console.log(error);
                    Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                } else {
                    console.log(response);
                    return true;
                }
            });
        } else {
            Bert.alert('Not authorized!.', 'danger', 'fixed-top', 'fa-frown-o');
        }
        return false;
    },

    "change #noOfGuests": function(event, template) {
        var participant = $(event.currentTarget).val();
        // console.log("participant: " + participant);
        noOfGuests = participant;
    },

    "click .add-sched": function(event) {
        var schedules = Session.get('schedules');
        var scheduleId = Math.floor(Math.random() * 1000);

        schedules.push({scheduleId: scheduleId, from: getDateTime(), to: getDateTime()});
        Session.set('schedules', schedules);

        // console.log('ScheduleID: ' + scheduleId);
        // console.log(Session.get('schedules'));

        $('#start_'+scheduleId).datetimepicker();
        $('#end_'+scheduleId).datetimepicker();
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

// Add Dates
Template.adddates.events({
    'click .remove-sched': function(event) {
        var scheduleId = Template.instance().$('.scheduleItem').attr('scheduleId');
        var schedules = Session.get('schedules');

        schedules = _.reject(schedules, function(x) {
            return x.scheduleId == scheduleId;
        });

        Session.set('schedules', schedules);

        // console.log(Session.get('schedules'));
    },
    'dp.change .datetimepicker': function(event, tmpl) {
        var target = event.target;
        var scheduleId = target.id;
        var value = $('#dp_' + target.id).val();
        // console.log('New value: ' + value);
        scheduleId = scheduleId.replace('start_', '').replace('end_', '').trim();
        
        var schedules = Session.get('schedules');
        var result = $.grep(schedules, function(e){ return e.scheduleId == scheduleId; });
        if(result) {
            // debugger;
            if (target.id.indexOf("start") >= 0) {
                result[0].from = value;
            } else if(target.id.indexOf("end") >= 0) {
                result[0].to = value;
            }
        }
        schedules = _.reject(schedules, function(x) {
            return x.scheduleId == scheduleId;
        });
        schedules.push(result[0]);
        Session.set('schedules', schedules);
        // console.log(Session.get('schedules'));
    }
});

Template.adddates.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({
        timeZone: 'Asia/Singapore',
        useCurrent: true,
        sideBySide: true
    });
});