function getMessageByCode(msgCode) {
    switch (msgCode) {
      case 100: return "Missing required fields: email, password, or language. Please fill them out. 😉";
      case 101: return "User not found. Please check your credentials or register. 😨";
      case 102: return "Password incorrect. Please try again. 😢";
      case 103: return "User not verified yet. Please verify your account. 😤";
      case 104: return "User exists and logged in successfully! 😍";
      case 105: return "Ready to login! 🤞";
      case 200: return "Missing required fields: fullname, password, email, or language. 😉";
      case 201: return "Invalid login type. 🤨";
      case 202: return "Invalid email format. 🙄";
      case 203: return "User already registered. Please log in to continue. 😑";
      case 204: return "User registered successfully! 😍";
      case 205: return "Ready to sign up! 🤞";
      case 206: return "Failed to send OTP. Please try again later. 😗";
      case 207: return "OTP sent to email successfully! 😊";
      case 208: return "User does not exist. 😒";
      case 209: return "Invalid OTP. 😑";
      case 210: return "User verified successfully! 🥰";
      case 211: return "Internal server error during OTP verification. 🤔";
      case 212: return "All fields (id, password, language) are required. 😞";
      case 213: return "User is not verified. Please complete OTP verification first. 🙂";
      case 214: return "Password reset successfully! 🎉";
      case 215: return "Internal server error during password reset. 🤔";
      case 216: return "Send a POST request with an email to initiate password reset.";
      case 217: return "Unable to update OTP. User not found in the database. 🤔";
      case 500: return "Internal server error. Please try again later. 😥";
      default: return "Unknown message code. Please check your implementation.";
    }
  }

module.exports = getMessageByCode;