const bcrypt = require("bcrypt");
const farmer = require("../../databasevariables/farmerSchema");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const signup = require("./signup");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Emailvalidator = require("email-validator");

const getMessageByCode = require("./authMsgCode");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "udityap.davegroup@gmail.com",
    pass: process.env.EMAILPASSWORD,
  },
});

const result = {
  get_enteremail: (req, res) => {
    res.json({
      success: true,
      method: "post",
      msgCode: 216, // Code for "Send a POST request with an email to initiate password reset."
      msg: getMessageByCode(216),
    });
  },

  post_enteremail: async (req, res) => {
    const { email } = req.body;

    try {
      // Validate email format
      if (!Emailvalidator.validate(email)) {
        return res.status(400).json({
          success: false,
          msgCode: 202, // Code for "Invalid email format"
          msg: getMessageByCode(202),
        });
      }

      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      const userExists = await signup.userexist(email);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          msgCode: 208, // Code for "User does not exist"
          msg: getMessageByCode(208),
        });
      }

      const user = await farmer.findOneAndUpdate(
        { email },
        { otp, verified: false }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          msgCode: 217, // Code for "Unable to update OTP. User not found in the database"
          msg: getMessageByCode(217),
        });
      }

      // Send email with OTP
      const mailOptions = {
        from: "udityap.davegroup@gmail.com",
        to: email,
        subject: "Reset Password for AgroMitra",
        html: `
          <div style="max-width: 90%; margin: auto; padding-top: 20px;">
            <p>Please enter the OTP below to reset your password:</p>
            <h1 style="text-align: center;">${otp}</h1>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error("Failed to send email:", error.message);
          return res.status(500).json({
            success: false,
            msgCode: 206, // Code for "Failed to send OTP"
            msg: getMessageByCode(206),
          });
        }

        res.status(200).json({
          success: true,
          msgCode: 207, // Code for "OTP sent to email successfully"
          msg: getMessageByCode(207),
        });
      });
    } catch (error) {
      console.error("Error in post_enteremail:", error.message);
      res.status(500).json({
        success: false,
        msgCode: 500, // Code for "Internal server error"
        msg: getMessageByCode(500),
        error: error.message,
      });
    }
  },

  post_otp_verification: async (req, res) => {
    const { otp, email } = req.body;

    try {
      // Validate fields
      if (!otp || !email || !Emailvalidator.validate(email)) {
        return res.status(400).json({
          success: false,
          msgCode: 100, // Code for "Missing required fields"
          msg: getMessageByCode(100),
        });
      }

      const userExists = await signup.userexist(email);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          msgCode: 208, // Code for "User does not exist"
          msg: getMessageByCode(208),
        });
      }

      const user = await farmer.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          msgCode: 217, // Code for "Unable to find user in the database"
          msg: getMessageByCode(217),
        });
      }
      console.log(user.otp, otp);
      if (user.otp != otp) {
        return res.status(400).json({
          success: false,
          msgCode: 209, // Code for "Invalid OTP"
          msg: getMessageByCode(209),
        });
      }

      // Update user to verified
      await farmer.findOneAndUpdate(
        { email },
        { otp: null, verified: true }
      );

      res.status(200).json({
        success: true,
        msgCode: 210, // Code for "User verified successfully"
        msg: getMessageByCode(210),
      });
    } catch (error) {
      console.error("Error in post_otp_verification:", error.message);
      res.status(500).json({
        success: false,
        msgCode: 211, // Code for "Internal server error during OTP verification"
        msg: getMessageByCode(211),
        error: error.message,
      });
    }
  },

  Set_password: async (req, res) => {
    const { id, password, language } = req.body;

    try {
      // Validate fields
      if (!id || !password || !language) {
        return res.status(400).json({
          success: false,
          msgCode: 212, // Code for "All fields are required"
          msg: getMessageByCode(212),
        });
      }

      const user = await farmer.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          msgCode: 208, // Code for "User not found"
          msg: getMessageByCode(208),
        });
      }

      if (!user.verified) {
        return res.status(403).json({
          success: false,
          msgCode: 213, // Code for "User is not verified"
          msg: getMessageByCode(213),
        });
      }

      // Hash the new password
      const saltRounds = parseInt(process.env.SALT, 10) || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update password and language
      await farmer.findByIdAndUpdate(id, {
        password: hashedPassword,
        language,
      });

      // Generate a JWT token
      const token = jwt.sign(
        { id: user._id, language },
        process.env.JWT_SECRET,
        // { expiresIn: "1h" } // Uncomment to enable token expiration
      );

      res.status(200).json({
        success: true,
        msgCode: 214, // Code for "Password reset successfully"
        msg: getMessageByCode(214),
        token,
      });
    } catch (error) {
      console.error("Error in Set_password:", error.message);
      res.status(500).json({
        success: false,
        msgCode: 215, // Code for "Internal server error during password reset"
        msg: getMessageByCode(215),
        error: error.message,
      });
    }
  },
};

module.exports = result;