import { Buddies } from '../../../../imports/collections/buddiesCol.js';
// Template.sidebar.onRendered(function(){

// })

Template.sidebar.helpers({
    activeClass: function (menu_name) {
        var routeName = FlowRouter.getRouteName();
        if (routeName === menu_name)
            return 'active'
    },
    buddyAccount: function() {
        let buddy = Buddies.find({ userId: Meteor.userId() }).fetch()[0];
        if (buddy != undefined && buddy._id && buddy.verified === true) { 
            return true;
        } else {
            return false;
        }
    }
})