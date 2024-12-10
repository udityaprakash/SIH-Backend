// Code: Middleware for admin
require("dotenv").config();
const jwt = require("jsonwebtoken");
const middleware = {
    isAdmin: (req, res, next) => {
        if (req.headers.token === process.env.ADMIN_TOKEN) {
            next();
        } else {
            res.status(401).json({
                success: false,
                msg: "unauthorized admin access 🤕"
            });
        }
    },
    setuser: (req,res,next)=>{
        try{    
            let token = req.headers.authorization;
            if(token){
                try{
                    token=token.split(" ")[1];
                    let user = jwt.verify(token, process.env.JWT_SECRET);
                    req.userId = user.id;
                    req.email = user.email;
                    console.log(req.userId, " ", req.email);
                    next();
                }catch(err){
                    res.status(401).json({succes:false, msg:"Invalid Action", error:err});
                }
            }
            else{
                res.status(401).json({succes:false, msg:"Header Should Contain Token"});
            }
            
        }catch(error){
            console.log(error);
            res.status(401).json({succes:false,msg:"unauthorized user", error:error});
        }
        
    },
    setusertoauthenticate: (req,res)=>{
        try{    
            let token = req.headers.authorization;
            if(token){
                try{
                    token=token.split(" ")[1];
                    let user = jwt.verify(token, process.env.JWT_SECRET);
                    // req.userId = user.id;
                    // req.email = user.email;
                    console.log(req.userId, " ", req.email);
                    res.json({success:true,userinfo:{
                        id:user.id,
                        email:user.email
                    }, msg:"User Authenticated"});
                }catch(err){
                    res.status(401).json({succes:false, msg:"Invalid Action", error:err});
                }
            }
            else{
                res.status(401).json({succes:false, msg:"Header Should Contain Token"});
            }
            
        }catch(error){
            console.log(error);
            res.status(401).json({succes:false,msg:"unauthorized user", error:error});
        }
        
    }
}

module.exports = middleware;