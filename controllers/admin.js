const Admin = require("../models/admin.js");

const helper = require("../helper.js");

const bcrypt = require("bcryptjs");

module.exports = {
    /*
    POST: create a new admin
    req.body = {
        email: String
        password: String
        confirmPassword: String
    }
    */
    create: function(req, res){
        let email = req.body.email.toLowerCase();

        Admin.findOne({email: email})
            .then((admin)=>{
                if(admin) throw "exists";
                if(req.body.password.length < 10) throw "short";
                if(req.body.password !== req.body.confirmPassword) throw "match";

                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(req.body.password, salt);

                let newAdmin = new Admin({
                    email: email,
                    password: hash,
                    status: "unapproved",
                    session: helper.generateSession()
                });

                req.session.admin = newAdmin.session;

                return newAdmin.save();
            })
            .then((admin)=>{
                return res.redirect("/admin/dashboard");
            })
            .catch((err)=>{
                req.session.banner = "error";
                
                switch(err){
                    case "exists":
                        req.session.bannerMessage = "User with this email already exists";
                        return res.redirect("/admin/login");
                    case "short":
                        req.session.bannerMessage = "Password must contain at least 10 characters";
                        return res.redirect("/admin/register");
                    case "match":
                        req.session.bannerMessage = "Passwords do not match";
                        return res.redirect("/admin/register");
                    default:
                        console.error(err);
                        req.session.bannerMessage = "Internal error";
                        return res.redirect("/");
                }
            });
    }
}