const User = require("../models/user.js");

const helper = require("../helper.js");

const bcrypt = require("bcryptjs");

module.exports = {
    /*
    POST: create user 
    req.body = {
        email: String
        password: String
        confirmPassword: String
    }
    redirect: "/user/dashboard"
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

                req.session.user = newUser._id;

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
    }
}