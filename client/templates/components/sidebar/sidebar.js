//import { Buddies } from '../../../../imports/collections/buddiesCol.js';
// Template.sidebar.onRendered(function(){

// })
Template.sidebar.onCreated(function(){

    var self = this;
    self.isBuddy = new ReactiveVar(false);

});

Template.sidebar.onRendered(function(){
    
    const instance = Template.instance();
    
    var data={
        "userId": Meteor.userId()
    };

    Meteor.call("getABuddy", data, function(error, response){

        if(error || response == false){
            instance.isBuddy.set(false);
        }else{
            instance.isBuddy.set(true);
        }
    });
});

Template.sidebar.helpers({
    activeClass: function (menu_name) {
        var routeName = FlowRouter.getRouteName();
        if (routeName === menu_name)
            return 'active'
    },
    buddyAccount: function() {
        
        const instance = Template.instance();
        
        return instance.isBuddy.get();
    }
});