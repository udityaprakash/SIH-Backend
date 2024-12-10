const router = require("express").Router();
const signup = require("../src/authentications/user/signup");
const login= require("../src/authentications/user/login");
const dashboard=require("../src/utils/user/user_profile");
const forgetpass=require("../src/authentications/user/forgetpass");
const event = require("../src/utils/admin/event");
const weather = require("../src/weather/fetchweatherdata");
const middleware = require("../src/utils/admin/middleware");
const { upload } = require("../src/utils/user/filevalidator");
const {setup, send} = require("../src/utils/user/home");

//--user/signup
router.post('/signup',signup.post);
router.get('/signup',signup.get);
router.get('/signup/verifyotp/:email',signup.verifyotp);
router.post('/signup/verifyotp/:email',signup.checkotp);


//oAuth
router.post('/googleoauth',signup.oauth);

//--user/login
router.post('/login',login.post);
router.get('/login',login.get);
router.get('/login/forgetpass',forgetpass.get_enteremail);
router.post('/login/forgetpass',forgetpass.post_enteremail);
router.post('/login/forgetpass/verification',forgetpass.post_otp_verification);
router.post('/login/forgetpass/setpassword',forgetpass.Set_password);

router.post('/authenticatetoken',middleware.setusertoauthenticate);


//--user/dashboard
router.post('/dashboard',middleware.setuser, dashboard.get);
router.get('/weather/:lat/:lon',weather);
router.post('/getnpk/:lat/:lon', middleware.setuser, upload.single('image'), setup.testimagefornpk);
router.get('/getimage/:db/:id', send.image);
router.post('/storeanyimage',middleware.setuser,upload.single('image'), send.storeimage);

router.get('/latest-events',event.getEvents);

router.all("*",(req,res)=>{
    res.status(404).json({
        success:false,
        msg:"page not found/ api does'nt exist 😒."
    });
});



module.exports = router;