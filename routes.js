const home = require("./controllers/home.js");

module.exports = (app)=>{
    let views = `${__dirname}/views/`;

    //USERS
    app.get("/user/register", (req, res)=>res.sendFile(`${views}/user/register.html`));

    //OTHER
    app.get("/", (req, res)=>res.sendFile(`${views}/landingPage.html`));
}