import { Tours } from '../../imports/collections/toursCol.js';

UploadServer.init({
    tmpDir: '/tmp/',
    uploadDir: '/Users/jervineang/Documents/GitHub/yaplinV1/public/assets/images/',
    //uploadDir: '/Users/karlfonacier/Projects/Bin/yaplinv1/uploads/',
    checkCreateDirectories: true,
    uploadUrl: '/uploads/',
    // *** For renaming files on server
    getFileName: function(file, formData) {
        return new Date().getTime() + '-' + Math.floor((Math.random() * 10000) + 1) + '-' + file.name; 
        // we get this value in the ajax response
    }
});

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
    UpdateTour: function(data) {
        try {
            Tours.update(data._id, {$set: 
                { title: data.title, 
                  location: data.location,
                  guests: data.guests,
                  price: data.price,
                  summary: data.summary,
                  experience: data.experience,
                  exp_expectation: data.exp_expectation,
                  provision: data.provision,
                  prov_expectation: data.prov_expectation,
                  schedules: data.schedules, 
                  photos: data.photos, 
                }
            });
        
            console.log("Update: OK");
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
           
        }catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    },
    
    getTourDetails : function(data){
        
        try{
            const tours = Tours.find({"_id": data.tour_id}).fetch();
            
            return tours[0];
            
        }catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    },
    getNumGuest: function(data){
        try{
            const tour = Tours.find(data).fetch();
            
            return tour[0].guests;
            
        }catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    },
    getTourByBuddy : function(data){
        
        try{
            
            const tours = Tours.find({"buddy_id": data.buddy_id}).fetch();
            
            return tours;
            
        }catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error('500', exception.message);
        }
    }
});