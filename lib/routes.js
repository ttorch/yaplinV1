
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

FlowRouter.route('/find',{
    name: "findbuddy",
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'whatwedo', bottom: 'footer' }
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
        //console.log(params)
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

function trackRouteEntry(context) {
    console.log('ROUTE ENTRY');
    console.log(context.route.name);
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