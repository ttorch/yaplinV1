Meteor.methods({
    Signup : function(user) {
        try {
            let user_count = Meteor.users.find().count();
            let user_id = Accounts.createUser({
                email: user.email,
                password: user.password,
                profile: {
                    firstName: user.firstname,
                    lastName: user.lastname,
                    gender: "",
                    dob: "",
                    age: 0,
                    contact: "",
                    street: "",
                    city: "",
                    country: ""
                }
            });

            let roles = ['normal', 'user'];
            if (user_count == 0) 
                roles = ['admin', 'owner'];
            
            Roles.addUsersToRoles(user_id, roles);

            if (user_id)
                return user_id;
            else
                throw new Meteor.Error('Unexpected error while saving information. Please try again.');
        } catch (error) {
            console.log('SERVER ERROR');
            console.log(error);
            throw new Meteor.Error(error);
        }
    },

    UpdateProfile : function(data) {
        try {
            if (!Meteor.userId()){
                throw new Meteor.Error('500','Not authorized!');
            }
            var result = Meteor.users.update(Meteor.userId() ,{
                $set: {
                    profile: {
                        firstName: data.firstname,
                        lastName: data.lastname,
                        alias: data.alias,
                        gender: data.gender,
                        dob: data.dateofbirth,
                        contact: data.contact,
                        street: data.street,
                        city: data.city,
                        country: data.country,
                        about: data.about,
                        avatar: data.imageurl
                    }
                }              
            });
            console.log("SERVER METHOD: UpdateProfile IMG URL");
            console.log(data.imageurl);
            console.log(result);
            if (result)
                return result;
            else
                throw new Meteor.Error('Unexpected error while updating profile information. Please try again.');
        } catch (error) {
            console.log("SERVER METHOD: UpdateProfile EXCEPTION");
            console.log(error);
            throw new Meteor.Error(error);
        }
    },

    UpdateProfileImage : function(data) {
        try {
            if (!Meteor.userId()){
                throw new Meteor.Error('500','Not authorized!');
            }

            var result = Meteor.users.update(Meteor.userId() ,{
                $set: {
                    'profile.avatar': data.imageurl
                }              
            });
            console.log("SERVER METHOD: UpdateProfile IMG URL");
            console.log(result);
            if (result)
                return result;
            else
                throw new Meteor.Error('Unexpected error while updating profile information. Please try again.');
        } catch (error) {
            console.log("SERVER METHOD: UpdateProfile EXCEPTION");
            console.log(error);
            throw new Meteor.Error(error);
        }
    },

    getAUser: function(data){
        try {
            const user = Meteor.users.findOne({
                _id: data._id
            });
        
            return user;
            
        } catch (error) {
            console.log("SERVER METHOD: getAUser EXCEPTION");
            console.log(error);
            throw new Meteor.Error(error);
        }
    }

});

