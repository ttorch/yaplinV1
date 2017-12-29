import { Buddies } from '../../imports/collections/buddiesCol.js';
import { Tours } from '../../imports/collections/toursCol.js';
import { TourDates } from '../../imports/collections/tourDatesCol.js';

Meteor.methods({
    CreateTour: function(data) {
        try {
            Buddies.insert(data);
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
            
            if(data.date!== undefined && data.date!=""){
                selector.date=data.date;
            }

            if(data.timeFrom!== undefined && data.timeFrom!=""){
                selector.time={"$gte":data.timeFrom};
            }

            /*if(data.timeTo!== undefined && data.timeTo!=""){
                selector.time_to={"$lte":data.timeTo};
            }*/

            if(data.noOfGuest!== undefined && data.noOfGuest!=""){
                selector.no_of_guest=parseInt(data.noOfGuest);
            }

            /*if(txtSearch!== undefined && txtSearch!=""){
                selector.title=txtSearch;
            }*/
           
           var pipeline = [
            {"$unwind": "$dates"},
            {"$match": { $or: [ { "dates.date": { $gte: "2017-12-27"} } ] }},
            {"$match": { "location": "UT" } }
           ];

           const tours=Tours.aggregate(pipeline); 
           
           return tours;
           
        }catch (exception) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    }
})