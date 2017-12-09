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
})