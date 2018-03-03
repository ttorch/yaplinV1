import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
    process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;
    Accounts.emailTemplates.from = "Verification Link";
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('reset-password/' + token);
    }
})
