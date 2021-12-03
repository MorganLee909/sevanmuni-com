const user = require("./controllers/user.js");

module.exports = (app)=>{
    let views = `${__dirname}/views/`;

    //USERS
    app.get("/user/register", (req, res)=>res.sendFile(`${views}/user/register.html`));

    app.post("/user/register", user.create);

    //OTHER
    app.get("/", (req, res)=>res.sendFile(`${views}/landingPage.html`));
}