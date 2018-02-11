

import { Buddies } from '../../imports/collections/buddiesCol.js';

Meteor.methods({
    BecomeABuddy: function(data) {
        try {
            if (!Meteor.userId()){
                throw new Meteor.Error('500','Please login before applying as a buddy.');
            }

            var buddyId = Buddies.insert({
                userId: Meteor.userId(),
                createAt: new Date(),
                verified: false,
                verifiedAt: null,
                verifiedBy: null,
                verificationSent: false,
                varificationCode: data.code,
                imageGallery: data.images
            });
            

            let html = 'Hi ' + Meteor.user().profile.firstName + ',<br>';
            html += '<p>Your Yaplin Buddy Verification Code is: ';
            html += '<strong>'+data.code+'</strong></p>';

            Meteor.call('SendEmail',
                Meteor.user().emails[0].address,
                'Admin <sixe.eeeeee@gmail.com>',
                'Hello from Yaplin! Please confirm your Buddy Account.',
                html, function(error, response){
                    if (error) {
                        Buddies.remove(buddyId);
                        console.log("SEND EMAIL ERROR CHILD: ", error);
                        buddyId = false;
                        throw error; //new Meteor.Error('500','Oops! Something went wrong when sending email.');                 
                    } else {
                        Buddies.update(buddyId, {
                            $set: { verificationSent: true },
                        });
                    }
                }
            );
            return buddyId;
        } catch (error) {
            throw new Meteor.Error('500','BAB Oops! Something went wrong.');
        }
    },

    VerifyBuddy: function(data) {
        try {
            if (!Meteor.userId()){
                throw new Meteor.Error('500','Invalid account.');
            }

            var buddy = Buddies.findOne({
                _id: data.id,
                userId: Meteor.userId(),
                varificationCode: data.verificationCode
            });

            if (buddy) {
                return Buddies.update( { 
                    _id: data.id,
                    userId: Meteor.userId(),
                    varificationCode: data.verificationCode 
                }, {
                    $set: { 
                        verified: true,
                        verifiedAt: new Date(),
                        verifiedBy: Meteor.userId()
                    }
                });
            } else {
                //throw new Meteor.Error('500','Invalid Buddy Account.');
                return false;
            }
            //console.log("RECORD ",buddy);
        } catch (error) {
            console.log(error);
            return false;
        }

    },
    getABuddy: function(data){
        
        try {
            
            var buddy = Buddies.findOne({
                userId: data.userId
            });
            
            if (buddy) {
                return buddy;
            } else {
                //throw new Meteor.Error('500','Invalid Buddy Account.');
                return false;
            }
            
        } catch (error) {
            console.log(error);
            return false;
        }
        
    }
})