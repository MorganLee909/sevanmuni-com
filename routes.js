const user = require("./controllers/user.js");
const other = require("./controllers/other.js");
const mid = require("./middleware.js");

module.exports = (app)=>{
    let views = `${__dirname}/views/`;

    //USERS
    app.get("/user/register", mid.banner, (req, res)=>res.render(`${views}/user/register.ejs`, {banner: res.locals.banner}));
    app.get("/user/login", mid.banner, (req, res)=>res.render(`${views}/user/login.ejs`, {banner: res.locals.banner}));
    app.get("/user/verify/notify", mid.banner, (req, res)=>res.render(`${views}/user/verify.ejs`, {banner: res.locals.banner}));
    app.get("/user/password/email", mid.banner,(req, res)=>res.render(`${views}/user/passwordEmail.ejs`, {banner: res.locals.banner}));
    app.get("/user/password/:id/:session", mid.banner, (req, res)=>res.render(`${views}/user/password.ejs`, {banner: res.locals.banner}));
    app.get("/user/dashboard", mid.auth("user"), mid.banner, (req, res)=>res.render(`${views}/user/dashboard.ejs`, {banner: res.locals.banner}));

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