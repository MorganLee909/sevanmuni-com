let User = require("./models/user.js");

module.exports = {
    /*
    Middleware for authorization
    allowed is one of:
        user: any user logged in
    */
    auth: function(allowed){
        return async (req, res, next)=>{
            switch(allowed){
                case "user":
                    res.locals.user = await this.getUser(req.session.user, res);
                    if(res.locals.user) next();
                    break;
            }
        }
    },

    getUser: function(session, res){
        return User.findOne({session: session})
            .then((user)=>{
                if(!user) throw "noUser";
                if(user.status.includes("unverified")) throw "unverified";

                return user;
            })
            .catch((err)=>{
                switch(err){
                    case "noUser": return res.redirect("/user/login");
                    case "unverified": return res.redirect("/user/verify/email");
                    default:
                        console.error(err);
                        return res.redirect("/");
                }
            })
    }
}