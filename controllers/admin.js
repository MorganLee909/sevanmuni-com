const Admin = require("../models/admin.js");

const helper = require("../helper.js");
const passwordEmail = require("../emails/passwordEmail.js");

const bcrypt = require("bcryptjs");
const axios = require("axios");
const queryString = require("querystring");

module.exports = {
    /*
    POST: create a new admin
    req.body = {
        email: String
        password: String
        confirmPassword: String
    }
    redirect: /admin/dashboard
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
    },

    /*
    POST: Admin login
    req.body = {
        email: String
        password: String
    }
    redirect: /admin/dashboard
    */
    login: function(req, res){
        let email = req.body.email.toLowerCase();

        Admin.findOne({email: email})
            .then((admin)=>{
                if(!admin) throw "noAdmin";

                bcrypt.compare(req.body.password, admin.password, (err, result)=>{
                    if(result){
                        req.session.admin = admin.session;

                        return res.redirect("/admin/dashboard");
                    }else{
                        req.session.banner = "error";
                        req.session.bannerMessage = "Email or password is incorrect";
                        return res.redirect("/admin/login");
                    }
                })
            })
            .catch((err)=>{
                req.session.banner = "error";

                switch(err){
                    case "noAdmin":
                        req.session.bannerMessage = "Email or password is incorrect";
                        return res.redirect("/admin/login");
                    default:
                        console.error(err);
                        req.session.bannerMessage = "Internal error";
                        return res.redirect("/");
                }
            });
    },

    /*
    POST: Send email to admin for password reset
    req.body = {
        email: String
    }
    redirect: /
    */
    passwordEmail: function(req, res){
        let email = req.body.email.toString();

        Admin.findOne({email: email})
            .then((admin)=>{
                if(!admin) throw "noAdmin";

                let link = `${req.protocol}://${req.get("host")}/admin/password/${admin._id}/${admin.session}`;

                return axios({
                    method: "post",
                    url: "https://api.mailgun.net/v3/mg.sevanmuni.com/messages",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    auth: {
                        username: "api",
                        password: process.env.MG_SEVANMUNI_KEY
                    },
                    data: queryString.stringify({
                        from: "sevanmuni.com <password-reset@sevanmuni.com>",
                        to: admin.email,
                        subject: "Password reset at sevanmuni.com",
                        html: passwordEmail(admin, link)
                    })
                });
            })
            .then(()=>{
                req.session.banner = "success";
                req.session.bannerMessage = "Email sent with instructions to reset your password";
                return res.redirect("/");
            })
            .catch((err)=>{
                req.session.banner = "error";

                switch(err){
                    case "noAdmin":
                        req.session.bannerMessage = "No admin with that email exists";
                        return res.redirect("/admin/password/email");
                    default:
                        console.error(err);
                        req.session.bannerMessage = "Internal error";
                        return res.redirect("/");
                }
            });
    },

    /*
    POST: Admin reset password
    req.body = {
        id: String
        session: string
        password: String
        confirmPassword: String
    }
    */
    passwordReset: function(req, res){
        Admin.findOne({_id: req.body.id})
            .then((admin)=>{
                if(!admin) throw "invalid";
                if(admin.session !== req.body.session) throw "invalid";
                if(req.body.password !== req.body.confirmPassword) throw "match";
                if(req.body.password.length < 10) throw "short";

                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(req.body.password, salt);

                admin.password = hash;
                admin.session = helper.generateSession();

                return admin.save();
            })
            .then((admin)=>{
                req.session.banner = "success";
                req.session.bannerMessage = "Password reset. Please log in.";
                return res.redirect("/admin/login");
            })
            .catch((err)=>{
                req.session.banner = "error";
                
                switch(err){
                    case "invalid":
                        req.session.bannerMessage = "Invalid URL";
                        return res.redirect("/");
                    case "match":
                        req.session.bannerMessage = "Your passwords do not match";
                        return res.redirect(`/admin/password/${req.body.id}/${req.body.session}`);
                    case "short":
                        req.session.bannerMessage = "Password must contain at least 10 characters";
                        return res.redirect(`/admin/password/${req.body.id}/${req.body.session}`);
                    default:
                        console.error(err);
                        req.session.bannerMessage = "Internal error";
                        return res.redirect("/");
                }
            });
    }
}