const Site = require("../models/site.js");

const axios = require("axios");

module.exports = {
    /*
    GET: display data for a single site
    req.params.id = Site id
    render: /site/display.ejs
    */
    display: function(req, res){
        Site.findOne({_id: req.params.id})
            .then((site)=>{
                return res.render("site/display.ejs", {
                    banner: res.locals.banner,
                    site: site
                });
            })
            .catch((err)=>{
                console.error(err);
                req.session.banner = "error";
                req.session.bannerMessage = "ERROR: unable to find that site";
                return res.redirect("/user/dashboard");
            });
    },

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
    response: {}
    */
    create: function(req, res){
        axios(`https://api.geocod.io/v1.7/geocode?q=${req.body.projectAddress}&api_key=${process.env.GEOENCODE_KEY}`)
            .then((addresses)=>{
                let add = addresses.data.results[0];

                let site = new Site({
                    projectName: req.body.projectName,
                    projectNumber: req.body.projectNumber,
                    phone: req.body.phone,
                    preparedBy: req.body.preparedBy,
                    address: {
                        number: add.address_components.number,
                        street: add.address_components.formatted_street,
                        city: add.address_components.city,
                        county: add.address_components.county,
                        state: add.address_components.state,
                        zip: add.address_components.zip,
                        country: add.address_components.country,
                        lat: add.location.lat,
                        long: add.location.long,
                        full: add.formatted_address
                    },
                    propertyType: req.body.propertyType,
                    surveyDate: new Date(req.body.surveyDate),
                    squareFootage: req.body.squareFootage,
                    parkingSpaces: req.body.parkingSpaces,
                    existingWC: req.body.existingWC,
                    contacts: req.body.contacts,
                    lastUpdate: new Date(),
                    codes: req.body.codes,
                    requirementsADA: req.body.requirementsADA,
                    reviewIssuesADA: req.body.reviewIssuesADA,
                    concernsADA: req.body.concernsADA,
                    applicablePermits: req.body.applicablePermits,
                    thirdPartyReviews: req.body.thirdPartyReviews
                });

                return site.save();
            })
            .then((site)=>{
                return res.json({id: site._id});
            })
            .catch((err)=>{
                console.error(err);
                return res.json("ERROR: unable to save the site");
            });
    }
}