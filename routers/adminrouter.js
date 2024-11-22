const router = require("express").Router();
const auth = require("../componnents/authentications/admin/auth");
const event = require("../componnents/utils/admin/event");
const middleware = require("../componnents/utils/admin/middleware");

router.post('/login',auth.login);
router.post('/create/event', middleware.isAdmin, event.createEvent);

router.all("*",(req,res)=>{
    res.status(404).json({
        success:false,
        msg:"page not found/ api does'nt exist 😒."
    });
});



module.exports = router;