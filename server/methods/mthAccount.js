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
                    alias: "",
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
    }
})