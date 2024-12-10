
const farmer = require("../../databasevariables/farmerSchema");
// import '../../server.js';
const result={
get: async (req,res)=>{
    const id=req.params['id'];
      try{
        const  result = await farmer.findOne({_id:req.userId});
        if(result){
          res.json({success:true,
          data:result, msg:"User data found"});
        }else{
          res.json({
            success:false,
            msg:"This user Does not exist"
          });
        }
      }catch(err){
        res.json({ success: false, error:err, msg:"something wrong in backend"});
  
      }
    
  
  }


}

module.exports = result;