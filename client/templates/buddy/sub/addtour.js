Template.addtour.onCreated(function() {
    document.title = "Yaplin - Add Tours";
});

Template.addtour.events({
    'submit form': function(event){
        alert('hi!');
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
})