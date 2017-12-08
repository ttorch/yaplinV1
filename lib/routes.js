
FlowRouter.route('/',{
    name: "home",
    action() {
        BlazeLayout.render('default', { top: 'header', main: 'home', bottom: 'footer' }
    )}
})

var becomeabuddyRoutes = FlowRouter.group({
    prefix: '/become-a-buddy'
})

becomeabuddyRoutes.route('/',{
    name: 'becomeabuddy',
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'becomeabuddy', bottom: 'footer' });
    }
})

// Buddy Routes
var buddyRoutes = FlowRouter.group({
    prefix: '/buddy'
})

buddyRoutes.route('/add-tour',{
    name: 'buddy.addtour',
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'addtour', bottom: 'footer' });
    }
})
