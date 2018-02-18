import { Buddies } from '../../../../imports/collections/buddiesCol.js';
noOfGuests = 1;
schedules = [];
var myDropzone = null;

Dropzone.options.dropzoneDiv = {
    maxFiles: 5,
    acceptedFiles: 'image/*',
    uploadMultiple: true,
    autoProcessQueue: false,
    addRemoveLinks: true,
    parallelUploads: 5,
    init: function() {
        
        myDropzone = this;
        
    },
    success: function(file, response){
        var photos = [];
        
        var res = JSON.parse(response);
        
        Object.keys(res.files).forEach(function (key){
            photos.push({
                'baseUrl': res.files[key].baseUrl, 
                'url': res.files[key].url, 
                'filename': res.files[key].name, 
                'filesize': res.files[key].size
            });
            
        });
        
        if(photos.length > 0) {
            Session.set('photos', photos);
        }
    }
};

function getDateTime() {
    var currentDateTime = new Date();
    return moment(currentDateTime).format("DD/MM/YYYY HH:mm");
}

function attachedDatepicker(){
    $(".datetimepicker").datetimepicker({
        timeZone: 'Asia/Singapore',
        format: 'DD/MM/YYYY HH:mm',
        //date: new Date(),
        //useCurrent: true,
        sideBySide: true
    });
}


Template.addtour.onCreated(function() {
    
    var action = Session.get("action");
    var ucAction = action.charAt(0).toUpperCase() + action.slice(1);
    
    document.title = "Yaplin - "+ ucAction +" Tour";
    
    var self = this;
    this.tourdetails = new ReactiveVar({});
    this.schedules = new ReactiveVar({});
   
   Dropzone.autoDiscover = false;
});

Template.addtour.onRendered(function() {
    
    if(!Meteor.userId()){
        FlowRouter.go("/");
    }
    
    
    var action = Session.get("action");
    
    const instance = Template.instance();
    
    if(action == "update"){
        
        var data = {
            "tour_id": FlowRouter.getParam("tourId")
        };
        
        
        //retrieve from database
        Meteor.call("getTourDetails", data, function(error, response){
            
           if(response){
               
               instance.tourdetails.set(response);
               
               var schedules = new Array();
               
               Object.keys(response.schedules).forEach(function (key){
                   schedules.push({
                        scheduleId: response.schedules[key]["scheduleId"], 
                        from: moment(response.schedules[key]["from"]).format("DD/MM/YYYY HH:mm"), 
                        to: moment(response.schedules[key]["to"]).format("DD/MM/YYYY HH:mm")
                    });
                });
               
               instance.schedules.set(schedules);
               
               Meteor.setTimeout(function() {
                    attachedDatepicker();

               }, 10);
               
               var photos = new Array();
               var mockFile = {};
               var baseUrl = "";
                
               if(typeof response.photos!== "undefined"){
                
                Object.keys(response.photos).forEach(function (key){
                     photos.push({
                         baseUrl: response.photos[key]["baseUrl"], 
                         filename: response.photos[key]["filename"],
                         filesize: response.photos[key]["filesize"]
                     });

                     baseUrl = response.photos[key]["baseUrl"].replace("uploads/","assets/images/");

                     mockFile = { 
                         name: response.photos[key]["filename"], 
                         size: response.photos[key]["filesize"], 
                         status: Dropzone.ADDED,
                         url: baseUrl+ response.photos[key]["filename"]
                    };

                     myDropzone.files.push(mockFile);

                     myDropzone.emit('addedfile', mockFile);
                     myDropzone.createThumbnailFromUrl(mockFile, baseUrl+ response.photos[key]["filename"]);

                     myDropzone.emit('complete', mockFile);
                 });

             }
             
             Session.set("photos", photos);
             
            }else{
               Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
           }
           
        });
        
    }else{
        
        var schedules = new Array();
        
        var scheduleId = Math.floor(Math.random() * 1000);
        schedules.push({scheduleId: scheduleId, from: getDateTime(), to: getDateTime()});

        instance.schedules.set(schedules);
    
    }
    
    Meteor.setTimeout(function() {
        attachedDatepicker();

    }, 10);
    
});

Template.addtour.events({
    'submit form': function(event) {
        
        event.preventDefault();
        event.stopPropagation();
        
        var action = Session.get("action");
        
        var target = event.target;
        
        const instance = Template.instance();
        var arySchedules = new Array();
        var schedules = instance.schedules.get();
                
        
        //loop through to convert the datetime format
        //Session.get('schedules').forEach(function(s, i) {
        schedules.forEach(function(s, i) {
            
            arySchedules.push({
                scheduleId: s.scheduleId, 
                from: new Date(moment(s.from, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm Z")), 
                to: new Date(moment(s.to, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm Z")),
                //time_from: moment(s.from).format("HH:mm"),
                //time_to: moment(s.to).format("HH:mm"),
            });
        });
        
        myDropzone.processQueue();
        
        var buddy = Buddies.find({ userId: Meteor.userId() }).fetch()[0];
        
        if (buddy != undefined && buddy._id && buddy.verified === true) {
            
            
            if(action == "add"){
                var data = {
                    buddy_id: buddy._id,
                    title: target.title.value,
                    location: target.location.value,
                    guests: noOfGuests,
                    price: target.price.value,
                    summary: target.summary.value,
                    experience: target.experience.value,
                    exp_expectation: target.exp_expectation.value,
                    provision: target.provision.value,
                    prov_expectation: target.prov_expectation.value,
                    schedules: arySchedules,
                    photos: Session.get('photos')
                };
            
                Meteor.call('CreateTour', data, function(error, response){

                    if (error) {
                        console.log(error);
                        Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                    } else {

                        //reset session
                        Session.set('photos', null);

                        Bert.alert("Listing have added succcessfully!", 'success', 'fixed-top', 'fa-smile-o');
                        FlowRouter.go("/myaccount/listings");
                    }
                });
            }else if(action == "update"){
                
                var data = {
                    _id: instance.tourdetails.get()._id,
                    buddy_id: buddy._id,
                    title: target.title.value,
                    location: target.location.value,
                    guests: noOfGuests,
                    price: target.price.value,
                    summary: target.summary.value,
                    experience: target.experience.value,
                    exp_expectation: target.exp_expectation.value,
                    provision: target.provision.value,
                    prov_expectation: target.prov_expectation.value,
                    schedules: arySchedules,
                    photos: Session.get('photos')
                };
            
                Meteor.call('UpdateTour', data, function(error, response){

                    if (error) {
                        console.log(error);
                        Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                    } else {

                        //reset session
                        Session.set('photos', null);

                        Bert.alert("Listing have updated succcessfully!", 'success', 'fixed-top', 'fa-smile-o');
                        FlowRouter.go("/myaccount/listings");
                    }
                });
            }
        } else {
            Bert.alert('Not authorized!.', 'danger', 'fixed-top', 'fa-frown-o');
        }
        
        return false;
    },
    'change #noOfGuests': function(event, template) {
        var participant = $(event.currentTarget).val();
        // console.log("participant: " + participant);
        noOfGuests = participant;
    },

    'click .add-sched': function(event) {
        
        const instance = Template.instance();
        
        var schedules = instance.schedules.get();
        
        var scheduleId = Math.floor(Math.random() * 1000);

        schedules.push({scheduleId: scheduleId, from: getDateTime(), to: getDateTime()});
        
        instance.schedules.set(schedules);
        
        Meteor.setTimeout(function() {
            attachedDatepicker();

        }, 10);
    },
    'click .remove-sched': function(event) {
        
        const instance = Template.instance();
        
        var scheduleId = instance.$(event.currentTarget).closest('.scheduleItem').attr('scheduleId');
        var schedules = instance.schedules.get();

        schedules = _.reject(schedules, function(x) {
            return x.scheduleId == scheduleId;
        });

        //Session.set('schedules', schedules);
        instance.schedules.set(schedules);
        
    },
    'dp.change .datetimepicker': function(event, tmpl) {
        
        /*var target = event.target;
        var scheduleId = target.id;
        var value = $('#' + target.id).val();
        console.log("scheduleId " + scheduleId);
        
        scheduleId = scheduleId.replace('dp_start_', '').replace('dp_end_', '').trim();
        
        const instance = Template.instance();
        
        var schedules = instance.schedules.get();
        
        var result = $.grep(schedules, function(e){ return e.scheduleId == scheduleId; });
        
        Object.keys(schedules).forEach(function (key){
            
            if(schedules[key]["scheduleId"] == scheduleId){
                if (target.id.indexOf("start") >= 0) {
                    schedules[key]["from"]= value;
                } else if(target.id.indexOf("end") >= 0) {
                    schedules[key]["to"] = value;
                }
                
                instance.schedules.set(schedules);
            }
        });*/
        
    }
});

Template.addtour.helpers({
    participants: function(){
        return [1, 2, 3, 4, 5];
    },

    schedules: function() {
        //return Session.get('schedules');
        
        const instance = Template.instance();
        return instance.schedules.get();
    },
    action(){
        var action = Session.get("action");

        return action.charAt(0).toUpperCase() + action.slice(1);
    },
    tour(){
        const instance = Template.instance();

        return instance.tourdetails.get();
    },
    selected(val, selected){
        if(val == selected){
            return "selected";
        }else{
            return "";
        }
    },
    photos(){
        return Session.get("photos");
    }
});

Template.registerHelper('arrayify',function(obj){
    var result = [];
    
    if(typeof obj !== "undefined"){
        
        Object.keys(obj).forEach(function (key){
                
                result.push({
                    scheduleId: obj[key]["scheduleId"],
                    from: obj[key]["from"],
                    to: obj[key]["to"],
                });
        });
        
    }
    
    
    return result;
});

