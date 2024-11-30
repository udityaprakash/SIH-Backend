const bcrypt = require("bcrypt");
const farmer = require("../../databasevariables/farmerSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getMessageByCode = require("./authMsgCode");

const result = {
  post: async (req, res) => {
    try {
      console.log(req.body);
      let { email, password, language } = req.body;

      // Validate the presence of all required fields
      if (!email || !password || !language) {
        return res.status(400).json({
          success: false,
          msgCode: 100,
          msg: getMessageByCode(100),
        });
      }

      email = email.toLowerCase();
      const user = await farmer.findOne({ email });

      // Check if the user exists
      if (!user) {
        return res.status(404).json({
          success: false,
          msgCode: 101,
          msg: getMessageByCode(101),
        });
      }

      // Validate the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          msgCode: 102,
          msg: getMessageByCode(102),
        });
      }

      // Update user's language preference
      await farmer.findByIdAndUpdate(user._id, { language });

      // Check if the user is verified
      if (!user.verified) {
        return res.status(403).json({
          success: true,
          msgCode: 103,
          msg: getMessageByCode(103),
          verified: false,
          redirectUrl: `user/signup/verifyotp/${email}`,
        });
      }

      // Generate JWT token for the user
      const token = jwt.sign(
        { id: user._id, language },
        process.env.JWT_SECRET,
        // { expiresIn: "1h" } // Uncomment to add token expiration
      );

      return res.status(200).json({
        success: true,
        verified: true,
        token,
        msgCode: 104,
        msg: getMessageByCode(104),
        data: user,
      });
    } catch (error) {
      console.error("Error during login process:", error);
      res.status(500).json({
        success: false,
        msgCode: 500,
        msg: getMessageByCode(500),
      });
    }
  },
  get: (req, res) => {
    res.json({
      status: 200,
      msgCode: 105,
      msg: getMessageByCode(105),
    });
  },
};

module.exports = result;
