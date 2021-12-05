const user = require("./controllers/user.js");
const admin = require("./controllers/admin.js");
const other = require("./controllers/other.js");
const mid = require("./middleware.js");

module.exports = (app)=>{
    //USERS
    app.get("/user/register", mid.banner, (req, res)=>res.render("user/register.ejs", {banner: res.locals.banner}));
    app.get("/user/login", mid.banner, (req, res)=>res.render("user/login.ejs", {banner: res.locals.banner}));
    app.get("/user/verify/notify", mid.banner, (req, res)=>res.render("user/verify.ejs", {banner: res.locals.banner}));
    app.get("/user/password/email", mid.banner,(req, res)=>res.render("user/passwordEmail.ejs", {banner: res.locals.banner}));
    app.get("/user/password/:id/:session", mid.banner, (req, res)=>res.render("user/password.ejs", {banner: res.locals.banner}));
    app.get("/user/dashboard", mid.auth("user"), mid.banner, (req, res)=>res.render("user/dashboard.ejs", {banner: res.locals.banner}));

    app.post("/user/register", user.create);
    app.post("/user/login", user.login);
    app.get("/user/verify/email", user.sendVerifyEmail);
    app.get("/user/verify/:id/:session", user.verify);
    app.post("/user/password/email", user.passwordEmail);
    app.post("/user/password/reset", user.passwordReset);

    //ADMIN
    app.get("/admin/register", mid.banner, (req, res)=>res.render("admin/register.ejs", {banner: res.locals.banner}));

    //OTHER
    app.get("/", mid.banner, (req, res)=>res.render(`${views}/landingPage.ejs`, {banner: res.locals.banner}));
    app.get("/logout", other.logout);
    app.get("*", (req, res)=>res.render(`${views}/404.ejs`));
}