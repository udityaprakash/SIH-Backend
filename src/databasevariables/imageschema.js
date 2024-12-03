const express = require("express");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    refid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    image: {
        name: String,
        data: Buffer,
        contentType: String,
    }
    
},{timestamps:true});

const result = mongoose.model("image", schema);

module.exports = result;