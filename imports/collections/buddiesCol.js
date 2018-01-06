import { Mongo } from 'meteor/mongo';

export const Buddies = new Mongo.Collection('buddies');

// FS.debug = true;
// TourImages = new FS.Collection('tourImages', {
//     // stores: [new FS.Store.GridFS("tourImages")]
//     stores: [new FS.Store.FileSystem("tourImages", {path: "uploads"})]
// });

// TourImages.allow({
//     update: function () {
//         // add custom authentication code here
//         return true;
//     },
//     insert: function () {
//         // add custom authentication code here
//         return true;
//     }
// });