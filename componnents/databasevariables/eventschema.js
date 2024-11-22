const express = require("express");
const mongoose = require("mongoose");

const schema= new mongoose.Schema({
    eventName : {
     type:String,
     min:3,
     required:true
    },
    eventImageUrl: {
        type:String,
        min:5,
        require:true
       },
    eventDescription:{
      type:String,
      default:'Description will be made available soon!'
    },
    pricing:{
      type:Boolean,
      default:false
    },
    eventDate:{
      type:Date,
      required:true
    },
    eventStartTime:{
      type:String,
      required:true
    },
    eventEndTime:{
      type:String,
      required:false
    },
    location:{
      type:String,
      required:true
    },
    registration:{
        start:{
            type:Date,
            default:Date.now()
        },
        end:{
            type:Date,
            required:true
        },
        price:{
            type:Number,
            default:0
        },
    }
},
{
    timestamps:true
});

const result = mongoose.model("event" , schema);

module.exports = result;