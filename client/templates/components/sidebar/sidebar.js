// Template.sidebar.onRendered(function(){

// })

Template.sidebar.helpers({
    activeClass: function (menu_name) {
        var routeName = FlowRouter.getRouteName();
        if (routeName === menu_name)
            return 'active'
    }
})