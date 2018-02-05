
import { Buddies } from '../imports/collections/buddiesCol.js';
FlowRouter.route('/',{
    name: "home",
    action() {
        BlazeLayout.render('default', { top: 'header', main: 'home', bottom: 'footer' }
    )}
});

FlowRouter.route('/what-we-do',{
    name: "whatwedo",
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'whatwedo', bottom: 'footer' }
    )}
});

FlowRouter.route('/findbuddy',{
    name: "buddy.findbuddy",
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'findbuddy', bottom: 'footer' }
    )}
});

FlowRouter.route('/tour-details/:tourId',{
    name: "buddy.tourdetails",
    action(params) {
        BlazeLayout.render('default', { top: 'topnav', main: 'tourdetails', bottom: 'footer'}
    )}
});

FlowRouter.route('/confirmation/:bookingId',{
    name: "buddy.confirmation",
    action(params) {
        BlazeLayout.render('default', { top: 'topnav', main: 'confirmation', bottom: 'footer'}
    )}
});

var becomeabuddyRoutes = FlowRouter.group({
    prefix: '/become-a-buddy'
});

becomeabuddyRoutes.route('/',{
    name: 'becomeabuddy',
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'becomeabuddy', bottom: 'footer' });
    }
});

becomeabuddyRoutes.route('/register',{
    name: 'becomeabuddy.register',
    triggersEnter: [trackRouteEntry],
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'buddyregister', bottom: 'footer' });
    }
});

becomeabuddyRoutes.route('/status/:buddyId',{
    name: 'becomeabuddy.status',
    triggersEnter: [trackRouteEntry, checkBuddyParam],
    action(params) {
        console.log("BUDDY STATUS: ", params);
        BlazeLayout.render('default', { top: 'topnav', main: 'buddystatus', bottom: 'footer' });
    }
});

// Buddy Routes
var buddyRoutes = FlowRouter.group({
    prefix: '/buddy'
});

buddyRoutes.route('/add-tour',{
    name: 'buddy.addtour',
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'addtour', bottom: 'footer' });
    }
});

//My Account
var myAccountsRoutes = FlowRouter.group({
    prefix: '/myaccount'
});

myAccountsRoutes.route('/profile', {
    name: 'myaccount.profile',
    action() {
        BlazeLayout.render('default', { top: 'topnav', sidebar: 'sidebar', main: 'myaccount', bottom: 'footer' })
    }
});

myAccountsRoutes.route('/bookings', {
    name: 'myaccount.bookings',
    action() {
        BlazeLayout.render('default', { top: 'topnav', sidebar: 'sidebar', main: 'bookings', bottom: 'footer' })
    }
});

myAccountsRoutes.route('/inbox', {
    name: 'myaccount.inbox',
    action() {
        BlazeLayout.render('default', { top: 'topnav', sidebar: 'sidebar', main: 'inbox', bottom: 'footer' })
    }
});

// Reset Password
FlowRouter.route('/reset-password/:token', {
    name: "atResetPwd",
    action(params) {
        console.log("RESET TOKEN ROUTE: ", params.token)
        Session.set('resetPassword', params.token);
        BlazeLayout.render('default', { top: 'topnav', main: 'recovery', bottom: 'footer' }
    )}
})

FlowRouter.route('/forgot-password', {
    name: "atForgotPwd",
    action(params) {
        BlazeLayout.render('default', { top: 'topnav', main: 'recovery', bottom: 'footer' }
    )}
})


function trackRouteEntry(context) {
    Session.set('currentRouteName', FlowRouter.getRouteName());
    if (context.route.name === 'becomeabuddy.register' && !Meteor.userId()) {
        FlowRouter.go("becomeabuddy")
    }
}

function checkBuddyParam(context){
    console.log('ROUTE ENTRY - checkBuddyParam');
    // var buddyId = FlowRouter.getParam("buddyId");
    console.log(context.params);
    console.log('END ENTRY')
    var data = {
        id: context.params.buddyId
    }
    // Meteor.call('hasBuddyRecord', data, function(error, response){
    //     console.log(error,response);
    // });
}

// ----------------------------------------------------

FlowRouter.subscriptions = function() {
    this.register('subsBuddies', Meteor.subscribe('buddies'));
    console.log('GLOBAL SUBSCRIPTIONS ');
    
};