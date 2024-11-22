const express = require("express");
const bodyparser = require("body-parser");
const bcrypt=require("bcrypt");
const app = express();
require('dotenv').config()
const db = require("./src/databasevariables/db")
const cors = require("cors");

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static("public"));

db.connection();


//routes
app.use('/farmer',require('./routers/farmerrouter'));
app.use('/admin', require('./routers/adminrouter'));

const port= process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.json({
      status:200,
      msg:"server is up and running!😘"
    });
});

app.all("*",(req,res)=>{
    res.status(404).json({
        success:false,
        msg:"page not found/ api does'nt exist 😒."
    });
});

if(process.env.NODE_ENV === 'development'){

    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    });
}else{

    module.exports = app;
}
