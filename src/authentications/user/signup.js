const bcrypt = require("bcrypt");
const Emailvalidator = require("email-validator");
require("dotenv").config();
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const farmer = require("../../databasevariables/farmerSchema");
const getMessageByCode = require("./authMsgCode");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "udityap.davegroup@gmail.com",
    pass: process.env.EMAILPASSWORD,
  },
});

// Utility function to get messages by code
// function getMessageByCode(msgCode) {
//   switch (msgCode) {
//     case 200: return "Missing required fields: fullname, password, email, or language. 😉";
//     case 201: return "Invalid login type. 🤨";
//     case 202: return "Invalid email format. 🙄";
//     case 203: return "User already registered. Please log in to continue. 😑";
//     case 204: return "User registered successfully! 😍";
//     case 205: return "Ready to sign up! 🤞";
//     case 206: return "Failed to send OTP. Please try again later. 😗";
//     case 207: return "OTP sent to email successfully! 😊";
//     case 208: return "User does not exist. 😒";
//     case 209: return "Invalid OTP. 😑";
//     case 210: return "User verified successfully! 🥰";
//     case 211: return "Internal server error during OTP verification. 🤔";
//     case 500: return "Internal server error. Please try again later. 😥";
//     default: return "Unknown message code. Please check your implementation.";
//   }
// }

const result = {
  post: async (req, res) => {
    try {
      const { fullname, password, email, language, loginType } = req.body;

      // Validate required fields
      if (!fullname || !password || !email || !language) {
        return res.status(400).json({
          success: false,
          msgCode: 200,
          msg: getMessageByCode(200),
        });
      }

      // Validate email format
      if (!Emailvalidator.validate(email)) {
        return res.status(400).json({
          success: false,
          msgCode: 202,
          msg: getMessageByCode(202),
        });
      }

      const userExists = await result.userexist(email.toLowerCase());
      if (userExists) {
        return res.status(409).json({
          success: false,
          msgCode: 203,
          msg: getMessageByCode(203),
        });
      }

      // Hash password
      const saltRounds = parseInt(process.env.SALT, 10) || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Save user to database
      const newUser = new farmer({
        fullname,
        password: hashedPassword,
        email: email.toLowerCase(),
        language,
        loginType,
      });

      await newUser.save();
      return res.status(201).json({
        success: true,
        msgCode: 204,
        msg: getMessageByCode(204),
      });
    } catch (error) {
      console.error("Error in user registration:", error.message);
      return res.status(500).json({
        success: false,
        msgCode: 500,
        msg: getMessageByCode(500),
        error: error.message,
      });
    }
  },

  get: (req, res) => {
    res.status(200).json({
      status: 200,
      msgCode: 205,
      msg: getMessageByCode(205),
    });
  },

  verifyotp: async (req, res) => {
    try {
      const { email } = req.params;
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      if (!Emailvalidator.validate(email)) {
        return res.status(400).json({
          success: false,
          msgCode: 202,
          msg: getMessageByCode(202),
        });
      }

      const user = await farmer.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          msgCode: 208,
          msg: getMessageByCode(208),
        });
      }

      if (user.verified) {
        return res.status(400).json({
          success: false,
          msgCode: 210,
          msg: getMessageByCode(210),
        });
      }

      await farmer.findOneAndUpdate({ email }, { otp });

      const mailOptions = {
        from: "udityap.davegroup@gmail.com",
        to: email,
        subject: "Verify Email from Ministry Of Agriculture",
        html: `
          <div style="max-width: 90%; margin: auto; padding-top: 20px;">
            <h2>Welcome to AgroMitra.</h2>
            <p>This is your OTP for email verification. Please enter this OTP to get started:</p>
            <h1 style="text-align: center;">${otp}</h1>
            <p>Thank you for joining AgroMitra!</p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error("Failed to send email:", error.message);
          return res.status(500).json({
            success: false,
            msgCode: 206,
            msg: getMessageByCode(206),
          });
        }

        return res.status(200).json({
          success: true,
          msgCode: 207,
          msg: getMessageByCode(207),
        });
      });
    } catch (error) {
      console.error("Error in verifyotp:", error.message);
      return res.status(500).json({
        success: false,
        msgCode: 211,
        msg: getMessageByCode(211),
        error: error.message,
      });
    }
  },

  userexist: async (email) => {
    try {
      const user = await farmer.findOne({ email });
      return !!user;
    } catch (error) {
      console.error("Error checking user existence:", error.message);
      throw new Error("Error checking user existence.");
    }
  },

  checkotp: async (req, res) => {
    try {
      const { otp } = req.body;
      const { email } = req.params;
      console.log(email, otp);

      if (!Emailvalidator.validate(email)) {
        return res.status(400).json({
          success: false,
          msgCode: 202,
          msg: getMessageByCode(202),
        });
      }

      const user = await farmer.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          msgCode: 208,
          msg: getMessageByCode(208),
        });
      }

      if (user.verified) {
        return res.status(400).json({
          success: false,
          msgCode: 210,
          msg: getMessageByCode(210),
        });
      }

      if (user.otp != otp) {
        return res.status(400).json({
          success: false,
          msgCode: 209,
          msg: getMessageByCode(209),
        });
      }

      await farmer.findOneAndUpdate(
        { email },
        { otp: null, verified: true }
      );

      return res.status(200).json({
        success: true,
        msgCode: 210,
        msg: getMessageByCode(210),
      });
    } catch (error) {
      console.error("Error in checkotp:", error.message);
      return res.status(500).json({
        success: false,
        msgCode: 211,
        msg: getMessageByCode(211),
        error: error.message,
      });
    }
  },
  oauth: async (req, res) => {
    try {
      const { id, fullname, email, language, loginType } = req.body;

      if (!id || !fullname || !email || !language || !loginType) {
        return res.status(400).json({
          success: false,
          msgCode: 200,
          msg: getMessageByCode(200),
        });
      }

      if (!Emailvalidator.validate(email)) {
        return res.status(400).json({
          success: false,
          msgCode: 202,
          msg: getMessageByCode(202),
        });
      }

      const userExists = await result.userexist(email.toLowerCase());
      if (userExists) {
        const token = jwt.sign({ id: userExists._id, email, language },process.env.JWT_SECRET);
            return res.status(200).json({
                success: true,
                msgCode: 205,
                msg: getMessageByCode(205),
                token,
            });
      }

      const newUser = new farmer({
        fullname,
        loginToken: id,
        email: email.toLowerCase(),
        language,
        loginType,
        verified: true,
      });

      await newUser.save();

      const ntoken = jwt.sign({ id: newUser._id, email, language },process.env.JWT_SECRET);
      return res.status(201).json({
        success: true,
        msgCode: 204,
        user:{
          id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          language: newUser.language,
          loginType: newUser.loginType,
      },
        msg: getMessageByCode(204),
        token: ntoken
      });
    } catch (error) {
      console.error("Error in oAuth registration:", error.message);
      return res.status(500).json({
        success: false,
        msgCode: 500,
        msg: getMessageByCode(500),
        error: error.message,
      });
    }
  }
};

module.exports = result;
