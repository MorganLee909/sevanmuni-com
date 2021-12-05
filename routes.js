const user = require("./controllers/user.js");
const other = require("./controllers/other.js");
const mid = require("./middleware.js");

module.exports = (app)=>{
    let views = `${__dirname}/views/`;

    //USERS
    app.get("/user/register", (req, res)=>res.render(`${views}/user/register.ejs`));
    app.get("/user/login", (req, res)=>res.render(`${views}/user/login.ejs`));
    app.get("/user/verify/notify", (req, res)=>res.render(`${views}/user/verify.ejs`));
    app.get("/user/password/email", (req, res)=>res.render(`${views}/user/passwordEmail.ejs`));
    app.get("/user/password/:id/:session", (req, res)=>res.render(`${views}/user/password.ejs`));
    app.get("/user/dashboard", mid.auth("user"), (req, res)=>res.render(`${views}/user/dashboard.ejs`));

    app.post("/user/register", user.create);
    app.post("/user/login", user.login);
    app.get("/user/verify/email", user.sendVerifyEmail);
    app.get("/user/verify/:id/:session", user.verify);
    app.post("/user/password/email", user.passwordEmail);
    app.post("/user/password/reset", user.passwordReset);

    //OTHER
    app.get("/", (req, res)=>res.render(`${views}/landingPage.ejs`));
    app.get("/logout", other.logout);
}