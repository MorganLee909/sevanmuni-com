const home = require("./controllers/home.js");

module.exports = (app)=>{
    let views = `${__dirname}/views/`;

    app.get("/", (req, res)=>res.sendFile(`${views}/landingPage.html`));
}