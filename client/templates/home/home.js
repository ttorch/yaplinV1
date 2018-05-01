Template.home.onCreated(function(){
    var title = "Yaplin - Home";
    DocHead.setTitle(title);
   
});

Template.home.onRendered(function(){
    
    var data = {
        date: Session.get("dateFilter"),
        noOfGuest: Session.get("noOfGuestFilter"),
        timeFrom: Session.get("timeFromFilter"),
        timeTo: Session.get("timeToFilter")
    };
    
    Meteor.call("SearchTour",data,function(error,response){
        
        Session.set("tours", null);
        
        if (error) {
            console.log(error);
            Bert.alert(error.error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
            Session.set("tours",response);
            
        }
    });
});

Template.home.helpers({
  tours() {
      return Session.get("tours");
  }
});

Template.registerHelper('arrayify_tour',function(obj){
    var result = [];
    
    if(typeof obj !== "undefined"){
        
        Object.keys(obj).forEach(function (key){
                
                var photos = null;
                
                if(typeof obj[key]["photos"]!="undefined"){
                    
                    photos=obj[key]["photos"];
                }
                
                result.push({
                    _id: obj[key]["_id"],
                    title: obj[key]["title"],
                    location: obj[key]["location"],
                    guests: obj[key]["guests"],
                    price: obj[key]["price"],
                    summary: obj[key]["summary"],
                    experience: obj[key]["experience"],
                    exp_expectation: obj[key]["exp_expectation"],
                    provision: obj[key]["provision"],
                    prov_expectation: obj[key]["prov_expectation"],
                    scheduleId: obj[key]["schedules"]["scheduleId"],
                    from: obj[key]["schedules"]["from"],
                    to: obj[key]["schedules"]["to"],
                    photos: photos,
                });
        });
    }
    
    
    return result;
});

Template.registerHelper('formatBookingDate',function(from,to){
    
    if(moment(moment(from).format("YYYY-MM-DD")).isSame(moment(to).format("YYYY-MM-DD"))){
        
        return moment(from).format("ddd, Do MMM") + " " + moment(from).format("HH:mm") + "-" + moment(to).format("HH:mm");
    }else{
        return moment(from).format("ddd, Do MMM") + " " + moment(from).format("HH:mm") + " - " + moment(to).format("ddd, Do MMM")+ " " +moment(to).format("HH:mm");
        //console.log("different day");
    }
    
});

Template.registerHelper('formatMemberJoinDate', function(date) { 
    return moment(date).format('MMM YYYY'); 
});

Template.registerHelper('maskPhoneNo', function(phoneNo) { 
    
    if(typeof phoneNo !== "undefined"){
        return phoneNo.replace(/^[0-9]{4}/, "**** ");
    }else{
        return "";
    }
});

Template.registerHelper('maskEmail', function(email) { 
    
    var endPos = 0;
    var newEmail  = "";
    
    if(typeof email !== "undefined"){
        endPos = email.indexOf("@");
    }
    
    for(var i=1; i<=endPos; i++){
        
        newEmail += "*";
    }
    
    return newEmail+email.substr(endPos);
});

Template.registerHelper("capitalize",function(str){
    
    if(typeof str === "string"){
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }

        // Directly return the joined string
        return splitStr.join(' ');
    }else{
        return "";
    }
});

Template.registerHelper('displayPhoto', function(photos) { 
    
    if(photos !== null){
        if(typeof photos[0].filename != "undefined"){
            
            return photos[0].filename;
        }else{
            return "home-exp.jpg";
        }
    }else{
        return "home-exp.jpg";
    }
});

Template.registerHelper('displayExpired', function(from){
    if(moment(from).isBefore(moment())){
        return Spacebars.SafeString("<span class='expired'>Expired</span>");
    }
});

