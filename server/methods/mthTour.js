import { Buddies } from '../../imports/collections/buddiesCol.js';

UploadServer.init({
    tmpDir: '/tmp/',
    uploadDir: '/Users/admiralato/uploads/',
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
            Buddies.insert(data);
            console.log("Create: OK");
            console.log(data);
            return "OK";
        } catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error(error);
        }
    }
});