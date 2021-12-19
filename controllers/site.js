const Site = require("../models/site.js");

const axios = require("axios");

module.exports = {
    /*
    POST: check entered address to find other sites in the same jurisdiction
    req.body = {
        address: String
    }
    */
    checkAddress: function(req, res){
        axios(`https://api.geocod.io/v1.7/geocode?q=${req.body.address}&api_key=${process.env.GEOENCODE_KEY}`)
            .then((addresses)=>{
                let address = addresses.data.results[0];

                return Site.find({"address.site": address.address_components.zip});
            })
            .then((sites)=>{
                return res.json(sites);
            })
            .catch((err)=>{
                console.error(err);
            });
    }
}