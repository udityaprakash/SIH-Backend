const bcrypt = require("bcrypt");
const farmer = require("../../databasevariables/farmerSchema"); 
const jwt = require("jsonwebtoken");
require('dotenv').config();


const result={
post: async (req,res)=>{
    console.log(req.body);
    let {email , password, language} = req.body;
    if(email && password && language){
      email = email.toLowerCase();
      const result = await farmer.find({ email: email });
      console.log(result);
      if(result != null){
            const match =await bcrypt.compare(password, result[0].password);
            if(match){
              console.log(result[0].verified);
              const updateLang = await farmer.findByIdAndUpdate(result[0]._id,{language:language});
              if(result[0].verified == true){
                const token = jwt.sign(
                  { id: result[0]._id, language:language },
                  (process.env.JWT_SECRET).toString(),
                  // {expiresIn: "1h"}
                );
                res.status(200).json({
                  success:true,
                  varified:true,
                  token:token,
                  msg:"User Exist and Logged in Successfully 😍",
                  data:result[0]
                });

              }else{
                res.json({
                  success:false,
                  msg:"user not verified yet please verify 😤",
                  verified:false,
                  redirecturl:"user/signup/verifyotp/:email"});
              }

            }else{
              res.status(401).json({
                success:false,
                msg:"Password incorrect 😢"
              });

            }


          }else{
            res.status(404).json({
              success:false,
              msg:"Email ID does'nt exist 😨"
            });
          }
  
  
    }else{
      res.status(400).json({success:false,
      msg:"One of the field Found Missing 😉"});
  }
  },
  get:(req,res)=>{
    res.json({
      status:200,
      msg:"ready to login 🤞"
    });
  }
}

module.exports = result;