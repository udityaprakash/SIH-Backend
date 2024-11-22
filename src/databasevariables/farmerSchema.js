const express = require("express");
const mongoose = require("mongoose");
const languages = ["en-US", "hi-IN", "bn-IN", "ta-IN", "te-IN", "gu-IN", "mr-IN", 
            "kn-IN", "ml-IN", "pa-IN", "or-IN", "as-IN", "ur-IN", "sd-IN", 
            "ne-IN", "sa-IN", "si-LK", "bo-IN", "dz-BT"];

const schema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        min: 3,
        required: true
    },
    password: {
        type: String,
        min: 8,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    },
    otp: {
        type: Number,
        default: null
    },
    verified: {
        type: Boolean,
        default: false
    },
    language: {
        type: String,
        enum: languages,
        default: "en-US",
        validate: {
            validator: function (v) {
                return /^[a-z]{2,3}(-[A-Z]{2})?$/.test(v);
            },
            message: "Invalid language format. Use BCP 47 format (e.g., en-US, hi-IN)."
        }
    },
    address: {
        type: String,
        trim: true,
        required: false
    },
    phoneNumber: {
        type: Number,
        min: 6000000000,
        max: 9999999999,
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false
        }
    },
    loginType: {
        type: String,
        enum: ["email", "google", "facebook","phnumber"],
        required: true
    },
    loginToken: {
        type: String,
        required: false
    },
    deviceId:{
        type: String,
        required: false
    }
},{timestamps:true});

const result = mongoose.model("farmer", schema);

module.exports = result;