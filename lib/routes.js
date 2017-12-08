
FlowRouter.route('/',{
    name: "home",
    action() {
        BlazeLayout.render('default', { top: 'header', main: 'home', bottom: 'footer' }
    )}
})

FlowRouter.route('/what-we-do',{
    name: "whatwedo",
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'whatwedo', bottom: 'footer' }
    )}
})

FlowRouter.route('/find',{
    name: "findbuddy",
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'whatwedo', bottom: 'footer' }
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

becomeabuddyRoutes.route('/register',{
    name: 'becomeabuddy.register',
    action() {
        BlazeLayout.render('default', { top: 'topnav', main: 'buddyregister', bottom: 'footer' });
    }
})