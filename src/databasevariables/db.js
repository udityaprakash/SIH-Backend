const express = require("express");
const student = require("./enduserschema");

require('dotenv').config();
const mongoose = require("mongoose");
var i=0;

const connectDB =  {
  connection: async () => {
            await mongoose.set("strictQuery", false);
            // await mongoose.connect("mongodb+srv://udityaprakash01:"+process.env.MONGODBPASS+"@cluster0.za5wk8j.mongodb.net/?retryWrites=true&w=majority", (err) => {   
            await mongoose.connect(process.env.CONNSTRING, (err) => {   
  
              if (!err) {
                console.log("db connected successfully");
                try{
                  student;
                }catch(err){
                  console.log("error in schema: "+err);
                  }
                } else {
                  console.log("Retrying connecting to database : " + i++);
                  connectDB.connection();
                }
              });
            }
            
          }
          
          
          module.exports=connectDB;
          //mongodb://localhost:27017/daway