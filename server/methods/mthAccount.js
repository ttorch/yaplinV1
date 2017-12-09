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
                        about: data.about
                    }
                }              
            });

            if (result)
                return Meteor.userId();
            else
                throw new Meteor.Error('Unexpected error while updating profile information. Please try again.');
        } catch (error) {
            throw new Meteor.Error(error);
        }
    }
})