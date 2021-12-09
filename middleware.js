let User = require("./models/user.js");
let Admin = require("./models/admin.js");

module.exports = {
    /*
    Middleware for authorization
    allowed is one of:
        user: any user logged in
    */
    auth: function(allowed){
        return async (req, res, next)=>{
            console.log(allowed);
            switch(allowed){
                case "user":
                    res.locals.user = await this.getUser(req.session.user, res, req);
                    if(res.locals.user) next();
                    break;
                case "admin":
                    res.locals.admin = await this.getAdmin(req.session.admin, res, req);
                    if(res.locals.admin) next();
                    break;
            }
        }
    },

    getUser: function(session, res, req){
        return User.findOne({session: session})
            .then((user)=>{
                if(!user) throw "noUser";
                if(user.status.includes("unverified")) throw "unverified";

                return user;
            })
            .catch((err)=>{
                req.session.banner = "error";

                switch(err){
                    case "noUser":
                        req.session.bannerMessage = "Please log in";
                        return res.redirect("/user/login");
                    case "unverified":
                        return res.redirect("/user/verify/email");
                    default:
                        console.error(err);
                        req.session.bannerMessage = "Internal error";
                        return res.redirect("/");
                }
            });
    },

    getAdmin: function(session, res, req){
        return Admin.findOne({session: session})
            .then((admin)=>{
                if(!admin) throw "noAdmin";
                if(admin.status === "unapproved") throw "unapproved";

                return admin;
            })
            .catch((err)=>{
                req.session.banner = "error";

                switch(err){
                    case "noAdmin":
                        req.session.bannerMessage = "Please log in";
                        return res.redirect("/admin/login");
                    case "unapproved":
                        req.session.bannerMessage = "Your account has not yet been approved";
                        return res.redirect("/");
                    default:
                        console.error(err);
                        req.session.bannerMessage = "Internal error";
                        return res.redirect("/");
                }
            });
    },

    banner: function(req, res, next){
        res.locals.banner = {
            type: null,
            message: null
        };

        if(req.session.banner){
            res.locals.banner = {
                type: req.session.banner,
                message: req.session.bannerMessage
            }
            req.session.banner = null;
            req.session.bannerMessage = null;
        }

        next();
    }
}