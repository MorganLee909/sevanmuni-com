const User = require("../models/user.js");

const helper = require("../helper.js");
const verifyEmail = require("../emails/emailVerification.js");
const passwordEmail = require("../emails/passwordEmail.js");

const bcrypt = require("bcryptjs");
const axios = require("axios");
const queryString = require("querystring");

module.exports = {
    /*
    POST: create user 
    req.body = {
        email: String
        password: String
        confirmPassword: String
    }
    redirect: "/user/verify/email"
    */
    create: function(req, res){
        let email = req.body.email.toLowerCase();

        User.findOne({email: email})
            .then((user)=>{
                if(user !== null) throw "userExists";
                if(req.body.password.length < 10) throw "shortPass";
                if(req.body.password !== req.body.confirmPassword) throw "passMatch";

                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(req.body.password, salt);

                let newUser = new User({
                    email: email,
                    password: hash,
                    status: ["unverified"],
                    session: helper.generateSession()
                });

                req.session.user = newUser.session;

                return newUser.save();
            })
            .then((user)=>{
                return res.redirect("/user/dashboard");
            })
            .catch((err)=>{
                switch(err){
                    case "userExists": return res.redirect("/user/login");
                    case "shortPass": return res.redirect("/user/register");
                    case "passMatch": return res.redirect("/user/register");
                    default:
                        console.error(err);
                        return res.redirect("/");
                }
            });
    },

    /*
    POST: User login
    req.body = {
        email: String
        password: String
    }
    redirect: /user/dashboard
    */
    login: function(req, res){
        let email = req.body.email.toLowerCase();

        User.findOne({email: email})
            .then((user)=>{
                if(!user) throw "noUser";

                bcrypt.compare(req.body.password, user.password, (err, result)=>{
                    if(result){
                        req.session.user = user.session;

                        return res.redirect("/user/dashboard");
                    }else{
                        return res.redirect("/user/login");
                    }
                })
            })
            .catch((err)=>{
                switch(err){
                    case "noUser": return res.redirect("/user/register");
                    default:
                        console.error(err);
                        return res.redirect("/user/login");
                }
            });
    },

    /*
    POST: send verification email to logged in user
    req.body = {
        email: String
    }
    redirect: /user/verify/notify
    */
    sendVerifyEmail: function(req, res){
        User.findOne({session: req.session.user})
            .then((user)=>{
                if(!user) throw "noUser";

                let link = `${req.protocol}://${req.get("host")}/user/verify/${user._id}/${user.session}`;

                axios({
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
                        from: "sevanmuni.com <verify@sevanmuni.com>",
                        to: user.email,
                        subject: "Verification Email from sevanmuni.com",
                        html: verifyEmail(user, link)
                    })
                }).catch(err=>console.error(err));

                return res.redirect("/user/verify/notify");
            })
            .catch((err)=>{
                switch(err){
                    case "noUser": return res.redirect("/user/login");
                    default:
                        console.error(err);
                        return res.redirect("/");
                }
            })
    },

    /*
    GET: verifies the users email address
    req.params = {
        id: User id
        session: User session
    }
    redirect: /user/dashboard
    */
    verify: function(req, res){
        User.findOne({_id: req.params.id})
            .then((user)=>{
                if(!user) throw "noUser";
                if(user.session !== req.params.session) throw "invalid";
                
                user.status.splice(user.status.indexOf("unverified"), 1);
                user.session = helper.generateSession();

                return user.save();
            })
            .then((user)=>{
                return res.redirect("/user/dashboard");
            })
            .catch((err)=>{
                switch(err){
                    case "noUser": return res.redirect("/");
                    case "invalid": return res.redirect("/");
                    default:
                        console.error(err);
                        return res.redirect("/");
                }
            })
    },

    /*
    POST: Send email for password reset
    req.body = {
        email: String
    }
    */
    passwordEmail: function(req, res){
        let email = req.body.email.toString();

        User.findOne({email: email})
            .then((user)=>{
                if(!user) throw "noUser";

                let link = `${req.protocol}://${req.get("host")}/user/password/${user._id}/${user.session}`;

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
                        to: user.email,
                        subject: "Password reset at sevanmuni.com",
                        html: passwordEmail(user, link)
                    })
                });
            })
            .then(()=>{
                return res.redirect("/");
            })
            .catch((err)=>{
                switch(err){
                    case "noUser": return res.redirect("/user/password/email");
                    default:
                        console.error(err);
                        return res.redirect("/");
                }
            });
    },

    /*
    POST: reset user's password
    req.body = {
        id: String
        session: String
        password: String
        confirmPassword: String
    }
    redirect: /user/login
    */
    passwordReset: function(req, res){
        User.findOne({_id: req.body.id})
            .then((user)=>{
                if(!user) throw "noUser";
                if(user.session !== req.body.session) throw "invalid";
                if(req.body.password.length < 10) throw "short";
                if(req.body.password !== req.body.password) throw "match";
                
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(req.body.password, salt);

                user.password = hash;
                user.session = helper.generateSession();

                return user.save();
            })
            .then((user)=>{
                return res.redirect("/user/login");
            })
            .catch((err)=>{
                switch(err){
                    case "noUser": return res.redirect("/");
                    case "invalid": return res.redirect("/");
                    case "short": return res.redirect(`/user/password/${req.body.id}/${req.body.session}`);
                    case "match": return res.redirect(`/user/password/${req.body.id}/${req.body.session}`);
                    default:
                        console.error(err);
                        return res.redirect("/");
                }
            });
    }
}