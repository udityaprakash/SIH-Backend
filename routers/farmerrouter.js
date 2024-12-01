const router = require("express").Router();
const signup = require("../src/authentications/user/signup");
const login= require("../src/authentications/user/login");
const dashboard=require("../src/utils/user/dashboard");
const forgetpass=require("../src/authentications/user/forgetpass");
const event = require("../src/utils/admin/event");
const weather = require("../src/weather/fetchweatherdata");

//--user/signup
router.post('/signup',signup.post);
router.get('/signup',signup.get);
router.get('/signup/verifyotp/:email',signup.verifyotp);
router.post('/signup/verifyotp/:email',signup.checkotp);




//--user/login
router.post('/login',login.post);
router.get('/login',login.get);
router.get('/login/forgetpass',forgetpass.get_enteremail);
router.post('/login/forgetpass',forgetpass.post_enteremail);
router.post('/login/forgetpass/verification',forgetpass.post_otp_verification);
router.post('/login/forgetpass/setpassword',forgetpass.Set_password);


//--user/dashboard
router.get('/dashboard/:id',dashboard.get);
router.get('/weather/:lat/:lon',weather);

router.get('/latest-events',event.getEvents);

router.all("*",(req,res)=>{
    res.status(404).json({
        success:false,
        msg:"page not found/ api does'nt exist 😒."
    });
});



module.exports = router;