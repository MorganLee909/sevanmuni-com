const user = require("./controllers/user.js");
const other = require("./controllers/other.js");
const mid = require("./middleware.js");

module.exports = (app)=>{
    let views = `${__dirname}/views/`;

    //USERS
    app.get("/user/register", (req, res)=>res.sendFile(`${views}/user/register.html`));
    app.get("/user/login", (req, res)=>res.sendFile(`${views}/user/login.html`));
    app.get("/user/verify/notify", (req, res)=>res.sendFile(`${views}/user/verify.html`));
    app.get("/user/password/email", (req, res)=>res.sendFile(`${views}/user/passwordEmail.html`));
    app.get("/user/password/:id/:session", (req, res)=>res.sendFile(`${views}/user/password.html`));
    app.get("/user/dashboard", mid.auth("user"), (req, res)=>res.sendFile(`${views}/user/dashboard.html`));

    app.post("/user/register", user.create);
    app.post("/user/login", user.login);
    app.get("/user/verify/email", user.sendVerifyEmail);
    app.get("/user/verify/:id/:session", user.verify);
    app.post("/user/password/email", user.passwordEmail);

    //OTHER
    app.get("/", (req, res)=>res.sendFile(`${views}/landingPage.html`));
    app.get("/logout", other.logout);
}