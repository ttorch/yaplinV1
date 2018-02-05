import { Buddies } from "../../imports/collections/buddiesCol.js";
Meteor.publish('buddies', function buddiesPublication(){
    // return Buddies.find({}, { 
    //     fields : { created_at: 0 }
    // });
    return Buddies.find({});
});

Meteor.publish('userList', function (){ 
  return Meteor.users.find({});
});