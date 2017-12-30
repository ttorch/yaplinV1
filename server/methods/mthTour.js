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
            
            const selector = {};
            
            var dateFromFilter = "";
            var dateToFilter = "";
            
            if(data.timeFrom!== undefined && data.timeFrom!=""){
                dateFromFilter += " "+data.timeFrom;
            }

            if(data.timeTo!== undefined && data.timeTo!=""){
                //selector.time_to={"$lte":data.timeTo};
                dateToFilter += " "+data.timeTo;
            }
            
            if(data.date!== undefined && data.date!=""){
                
                if(dateFromFilter != ""){
                    dateFromFilter = data.date + dateFromFilter;
                }
                
                if(dateToFilter != ""){
                    dateToFilter = data.date + dateToFilter;
                }
                
                if(dateToFilter == "" && dateFromFilter == ""){
                    dateToFilter = data.date;
                    dateFromFilter = data.date;
                }
            }
            
            if(dateFromFilter != ""){
                selector.$match= { "$or": [ { "schedules.from": { "$gte": dateFromFilter} } ] };
            }
            
            if(dateToFilter != ""){
                selector.$match= { "$or": [ { "schedules.from": { "$lte": dateToFilter} } ] };
            }

            if(data.noOfGuest!== undefined && data.noOfGuest!=""){
                selector.$match= { "guests": parseInt(data.noOfGuest)};
            }

            /*if(txtSearch!== undefined && txtSearch!=""){
                selector.title=txtSearch;
            }*/
            
           console.log(selector);
           
           var pipeline = [
            {"$unwind": "$schedules"},
            {"$match": { $or: [ { "schedules.from": { $gte: "2017-12-31 11:00"} } ] }},
            //{"$match": { "location": "Bukit Batok" } }
           ];

           const tours=Tours.aggregate(pipeline); 
           
           return tours;
           
        }catch (exception) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    }
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