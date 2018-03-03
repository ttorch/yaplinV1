var imagestorage = new FS.Store.GridFS("images")
ProfileImages = new FS.Collection("images", {
    stores: [imagestorage]
    // stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
});

// console.log("COOMON");
// FS.debug = true;
// var ImagesStore = new FS.Store.FileSystem('images-original', {
//     path: '~/uploads'
//   });
  
// Images = new FS.Collection('images', {
//     stores: [ImagesStore]
// });

// ProfileImages = new FS.Collection("ProfileImages", {
//     stores: [new FS.Store.GridFS("ProfileImages",)]
// });