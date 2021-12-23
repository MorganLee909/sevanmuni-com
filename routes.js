const user = require("./controllers/user.js");
const admin = require("./controllers/admin.js");
const other = require("./controllers/other.js");
const site = require("./controllers/site.js");

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
    app.get("/admin/login", mid.banner, (req, res)=>res.render("admin/login.ejs", {banner: res.locals.banner}));
    app.get("/admin/password/email", (req, res)=>res.render("admin/passwordEmail.ejs", {banner: res.locals.banner}));
    app.get("/admin/password/:id/:session", mid.banner, (req, res)=>res.render("admin/password.ejs", {banner: res.locals.banner}));
    app.get("/admin", (req, res)=>res.redirect("/admin/dashboard"));
    app.get("/admin/dashboard", mid.auth("admin"), mid.banner, (req, res)=>res.render("admin/dashboard.ejs", {banner: res.locals.banner, admin: res.locals.admin}));

    app.post("/admin/register", admin.create);
    app.post("/admin/login", admin.login);
    app.post("/admin/password/email", admin.passwordEmail);
    app.post("/admin/password/reset", admin.passwordReset);
    app.post("/admin/update", mid.auth("admin"), admin.update);
    app.get("/admin/session", mid.auth("admin"), admin.endSession);
    app.post("/admin/user/search", mid.auth("admin"), admin.userSearch);

    //SITE
    app.get("/site/new", mid.auth("employee"), mid.banner, (req, res)=>res.render("site/newSite.ejs", {banner: res.locals.banner}));
    app.get("/site/:id", mid.auth("employee"), mid.banner, site.display);

    app.post("/site/address", mid.auth("employee"), site.checkAddress);
    app.post("/site/new", mid.auth("employee"), site.create);

    //OTHER
    app.get("/", mid.banner, (req, res)=>res.render("landingPage.ejs", {banner: res.locals.banner}));

    app.get("/logout", other.logout);

    app.get("*", (req, res)=>res.render("404.ejs"));
}