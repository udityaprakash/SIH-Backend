const express = require("express");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    farmer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "farmer",
        required: true
    },
    soil_image: {
        name: String,
        data: Buffer,
        contentType: String,
    },
    email: String,
    lat: Number,
    lon: Number,
    test_result: {
        nitrogen: Number,
        phosphorus: Number,
        potassium: Number,
        soil_type: String,
        soil_moisture: Number,
        soil_ph: Number,
        soil_oc: Number
    },

    
},{timestamps:true});

const result = mongoose.model("soilimage", schema);

module.exports = result;