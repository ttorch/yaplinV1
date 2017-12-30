import { Buddies } from '../../imports/collections/buddiesCol.js';

Meteor.methods({
    CreateTour: function(data) {
        try {
            Buddies.insert(data);
            console.log("Create: OK");
            console.log(data);
            return "OK";
        } catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error(error);
        }
    }
});

TourImages.allow({
    update: function () {
        // add custom authentication code here
        return true;
    },
    insert: function () {
        // add custom authentication code here
        return true;
    }
});