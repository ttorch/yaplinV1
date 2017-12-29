Meteor.methods({
    SendEmail: function(to, from, subject, html) {
        try {
            this.unblock();
            Email.send({ to, from, subject, html });
            return true;
        } catch (error) {
            console.log("MAIN: ", error);
            throw error; //new Meteor.Error('500','Oops! Something went wrong when sending email (MAIN).');
        }
        
    }
})