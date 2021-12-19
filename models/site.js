const mongoose = require("mongoose");

const SiteSchema = new mongoose.Schema({
    projectName: String,
    projectNumber: String,
    phone: String,
    address: {
        number: String,
        street: String,
        city: String,
        county: String,
        state: String,
        zip: String,
        country: String,
        full: String,
        lat: Number,
        long: Number
    },
    propertyType: String,
    surveryDate: Date,
    squareFootage: {
        patio: Number,
        diningRoom: Number,
        total: Number,
        verificationMethod: String
    },
    parkingSpaces: Number,
    existingWC: {
        men: {
            occupancyCount: Number,
            lavatories: Number,
            toilets: Number,
            urinals: Number
        },
        women: {
            occupancyCount: Number,
            lavatories: Number,
            toilets: Number,
            urinals: Number
        },
        unisex: {
            occupancyCount: Number,
            lavatories: Number,
            toilets: Number,
            urinals: Number
        },
        employee: {
            occupancyCount: Number,
            lavatories: Number,
            toilets: Number,
            urinals: Number
        },
        handDryers: Number,
        faucets: Number,
        concernsADA: [String]
    },
    contacts: [{
        department: String,
        title: String,
        address: String,
        phone: String,
        email: String
    }],
    lastUpdated: Date,
    codes: {
        building: [String],
        fire: [String],
        pumbing: [String],
        electrical: [String],
        mechanical: [String],
        energy: [String],
        accessibility: [String],
        other: [String]
    },
    requirementsADA: [String],
    requirementsWC: [String],
    applicablePermits: [{
        permit: String,
        sequence: String,
        requirements: [String],
        applicationFees: Number,
        permitFees: Number,
        reviewTime: Number
    }],
    thirdPartyReviews: [String]
});

module.exports = mongoose.model("site", SiteSchema);