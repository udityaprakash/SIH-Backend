const bcrypt = require("bcrypt");
var Emailvalidator = require("email-validator");
require('dotenv').config()
const nodemailer=require("nodemailer");
const otpGenerator = require('otp-generator');
const farmer = require("../../databasevariables/farmerSchema");
 

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'udityap.davegroup@gmail.com',
    pass: process.env.EMAILPASSWORD
  }
});

function validateLoginType(loginType){
  if(loginType == "google" || loginType == "facebook" || loginType == "phnumber" || loginType == "email"){
    return true;
  }else{
    return false;
  }
}



const result={
post: async (req, res) => {
  console.log(req.body);
  let { fullname, password, email, language, loginType } = req.body;
  let hashedpassword;

  if (fullname && password && email && language) {
      const salt = parseInt(process.env.SALT);
      hashedpassword = await bcrypt.hash(password, salt);
      email = email.toLowerCase();

      try {
          if (!validateLoginType(loginType)) {
              return res.json({
                  success: false,
                  msg: "Invalid Login Type 🤨"
              });
          }

          if (!Emailvalidator.validate(email)) {
              return res.json({
                  success: false,
                  msg: "Invalid Email Format 🙄"
              });
          }

          if (await result.userexist(email)) {
              return res.json({
                  success: false,
                  msg: "Please login to continue 😑. User Already registered"
              });
          }

          const user = new farmer({
              fullname: fullname,
              password: hashedpassword,
              email: email,
              language: language,
              loginType: loginType,
          });

          await user.save()
              .then((user) => {
                  return res.status(200).json({
                      success: true,
                      msg: "User Recorded Successfully 😍"
                  });
              })
              .catch((err) => {
                  return res.status(400).json({
                      success: false,
                      error: err,
                      msg: "User not been recorded 😥"
                  });
              });

      } catch (error) {
          console.log("error: " + error);
          return res.status(500).json({
              success: false,
              msg: "Internal Server Error 😥",
              error: error.message
          });
      }

  } else {
      return res.json({
          success: false,
          msg: "One of the fields is missing 😉"
      });
  }
},
  get:(req,res)=>{
    res.json({
            status:200,
            msg:"ready to signup 🤞"
          });

  },

  verifyotp : async (req,res)=>{
    let email=req.params['email'];
    let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});

    if(Emailvalidator.validate(email)){
      if(await result.userexist(email)){
        var u = await farmer.findOne({email : email});
        if(u.verified == true){
          res.json({
            success:false,
            msg:"user already verified 😉"
          });
        }else{
          try{
            const sa = await farmer.findOneAndUpdate({email:email},{otp:otp});

            var mailOptions = {
                        from: 'udityap.davegroup@gmail.com',
                        to: email,
                        subject: 'Verify Email from Ministry Of Agriculture',
                        html: `
                    <div
                      class="container"
                      style="max-width: 90%; margin: auto; padding-top: 20px"
                    >
                      <h2>Welcome to AgroMitra.</h2>
                      <h4>Greetings of the day!</h4>
                      <p style="margin-bottom: 30px;">This is your OTP for email verification. Please enter this OTP to get started.</p>
                      <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
                      <p style="margin-bottom: 30px;">Reach out to us at IIT Hyderabad for further discussions.</p>
                 </div>`
            };

            transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log("not send :"+error);
                        } else {
                          console.log('Email sent: ' + info.response);
                          res.json({success:true,
                          msg:"OTP send to email successfully😊"});
                        }
            });




          }catch(err){
            res.json({
                        success:false,
                        msg:"Either email invalid or sender email invalid 😗"
            });

          }
        }

      }else{
        res.json({
          success:false,
          msg:"Email does not exist😁. Please verify it."
        });
      }
    }else{
      res.json({
        success:false,
        msg:"Invalid Email Format 🤬"
      });
    }
    

  },
  userexist: async (email)=>{
    var u = await farmer.find({email : email});
    if(u.length!=0){
      return true;
    }
    else{
      return false; 
    }

  },
  checkotp:async (req,res)=>{
    const {otp}=req.body;
    const email= req.params['email'];

    if(Emailvalidator.validate(email)){
      var resu = await farmer.find({email:email});
        if(resu.length!=0){
        if (resu[0].verified == false){
            if(resu[0].otp == otp){
              var result = await farmer.findOneAndUpdate({email:email},{otp:null,verified:true});
              console.log(result);
              res.json({
                success:true,
                token:resu[0]._id,
                result:result,
                msg:"user verified successfully 🥰"
              });

            }else{
              res.json({success:false,
              msg:"Invalid OTP 😑"});
              
            }



          }else{
              res.json({success:false,
              msg:"user is already verified 🙂"});
              
            }
          }else{
            res.json({success:false,
            msg:"user doesn't exist 😒"});
        }


  }
}
};

module.exports = result;