const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const session = require("cookie-session");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");

const app = express();

let mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

let httpsServer = {};
if(process.env.NODE_ENV === "production"){
    httpsServer = https.createServer({
        key: fs.readFileSync("/etc/letsencrypt/live/sevanmuni.com/privkey.pem", "utf8"),
        cert: fs.readFileSync("/etc/letsencrypt/live/sevanmuni.com/fullchain.pem", "utf8")
    });
    
    app.use((req, res, next)=>{
        if(req.secure === true){
            next();
        }else{
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });
    
    mongooseOptions.auth = {authSource: "admin"};
    mongooseOptions.user = "website";
    mongooseOptions.pass = process.env.MONGODB_PASS;
}

mongoose.connect("mongodb://127.0.0.1/sevanmuni", mongooseOptions);

app.use(express.static(`${__dirname}/views`));
app.use(compression());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: "Sevan Solutions Solving Some Shit",
    sameSite: "lax",
    saveUninitialized: true,
    resave: false
}));

require("./routes.js")(app);

if(process.env.NODE_ENV === "production") httpsServer.listen(process.env.HTTPS_PORT);
app.listen(process.env.PORT);