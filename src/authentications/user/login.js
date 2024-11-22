const bcrypt = require("bcrypt");
const path=require("../../../path");
const enduser= require("../../databasevariables/enduserschema"); 



const result={
post: async (req,res)=>{
    console.log(req.body);
    let {email , password} = req.body;
    if(email && password){
      email = email.toLowerCase();
      const result = await enduser.find({ email: email });
      console.log(result);
      if(result != null){
            const match =await bcrypt.compare(password, result[0].password);
            if(match){
              console.log(result[0].verified);
              if(result[0].verified == true){
                res.status(200).json({
                  success:true,
                  token:result[0]._id,
                  msg:"User Exist and Logged in Successfully 😍",
                  data:result[0]
                });
                // res.redirect("dashboard/"+ result[0]._id);

              }else{
                // res.redirect("signup/verifyotp/" + email );
                res.json({success:false,msg:"user not verified yet please verify 😤",
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
    })
    // res.sendFile(path+"/public/login.html");
  }
}

module.exports = result;