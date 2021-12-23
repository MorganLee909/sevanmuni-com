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

                return Site.find({"address.zip": address.address_components.zip});
            })
            .then((sites)=>{
                return res.json(sites);
            })
            .catch((err)=>{
                console.error(err);
            });
    },

    /*
    POST: create a new site
    req.body = Site
    redirect: /site/:id
    */
    create: function(req, res){
        axios(`https://api.geocod.io/v1.7/geocode?q=${req.body.projectAddress}&api_key=${process.env.GEOENCODE_KEY}`)
            .then((addresses)=>{
                let add = addresses.data.results[0];

                let site = new Site({
                    projectName: req.body.projectName,
                    address: {
                        number: add.address_components.number,
                        street: add.address_components.formatted_street,
                        city: add.address_components.city,
                        county: add.address_components.county,
                        state: add.address_components.state,
                        zip: add.address_components.zip,
                        country: add.address_components.country,
                        lat: add.location.lat,
                        long: add.location.long
                    },
                    propertyType: req.body.propertyType,
                    squareFootage: {
                        patio: req.body.patioFootage,
                        diningRoom: req.body.diningFootage,
                        total: req.body.totalFootage,
                        verificationMethod: req.body.footageMethod,
                    },
                    existingWC: req.body.existingWC,
                    contacts: req.body.contacts,
                    lastUpdate: new Date(),
                    codes: req.body.codes,
                    requirementsADA: req.body.requirementsADA,
                    reviewIssuesADA: req.body.reviewIssuesADA,
                    concernsADA: req.body.concernsADA,
                    applicablePermits: req.body.applicablePermits
                });

                return site.save();
            })
            .then((site)=>{
                return res.redirect(`/site/${site._id}`);
            })
            .catch((err)=>{
                return res.json("ERROR: unable to save the site");
            });
    }
}