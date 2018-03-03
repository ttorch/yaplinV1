Template.confirm.helpers({
    showDelete: function() {
        return Session.get('showDelete');
    },
    showFeedback: function(){
        
        return Session.get("showFeedback");
    }
});