import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
    Session.set("resetPass", false);
    Session.set('showRegister', false);

    // Accounts.urls.resetPassword = function(token) {
    //     return Meteor.absoluteUrl('reset-password/' + token);
    // }
})