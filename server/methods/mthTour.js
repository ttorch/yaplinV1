import { Buddies } from '../../imports/collections/buddiesCol.js';
import { Tours } from '../../imports/collections/toursCol.js';
import { TourDates } from '../../imports/collections/tourDatesCol.js';

Meteor.methods({
    CreateTour: function(data) {
        try {
            Tours.insert(data);
            console.log("Create: OK");
            console.log(data);
            return "OK";
        } catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error(error);
        }
    },
    SearchTour: function(data){
        
        try{
            
            var pipeline = [];
            
            pipeline.push({"$unwind": "$schedules"});
            
            var dateFromFilter = "";
            var dateToFilter = "";
            
            if(data.date!== undefined && data.date!=""){
                dateToFilter += data.date;
                dateFromFilter += data.date;
            }else{
                var today = moment().format("DD MMM YYYY");
                var endYear = moment().add(1,"year").format("DD MMM YYYY");
                dateFromFilter += today;
                dateToFilter += endYear;
            }
            
            if(data.timeFrom!== undefined && data.timeFrom!=""){
                dateFromFilter += " "+data.timeFrom;
            }else{
                dateFromFilter += " 23:59";
            }

            if(data.timeTo!== undefined && data.timeTo!=""){
                dateToFilter += " "+data.timeTo;
            }else{
                dateToFilter += " 23:59";
            }
            
            var dateFromTS = moment(dateFromFilter).valueOf();
            var dateToTS = moment(dateToFilter).valueOf();
            
            if(dateFromFilter != ""){
                pipeline.push({"$match": { "schedules.from": { $gte: new Date(dateFromTS)} }});
            }
            
            if(dateToFilter != ""){
                //pipeline.push({"$match": { "schedules.from": { $lte: new Date(dateToTS)} }});
            }

            if(data.noOfGuest!== undefined && data.noOfGuest!=""){
                pipeline.push({"$match": { "guests": parseInt(data.noOfGuest) }});
            }

            /*if(txtSearch!== undefined && txtSearch!=""){
                selector.title=txtSearch;
            }*/
           
           const tours=Tours.aggregate(pipeline); 
           
           return tours;
           
        }catch (exception) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    },
    
    getTourDetails : function(data){
        
        try{
            console.log("getTourDetails" + data.tour_id);
        }catch (exception) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    },
});

TourImages.allow({
    update: function () {
        // add custom authentication code here
        return true;
    },
    insert: function () {
        // add custom authentication code here
        return true;
    }
});