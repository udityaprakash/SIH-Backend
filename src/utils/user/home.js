const soilDB = require('../../databasevariables/soilimageschema');
const {compressor} = require('./filevalidator');
const imageDB = require('../../databasevariables/imageschema');

let setup = {
    testimagefornpk:async (req , res)=>{
        try {
            if (!req.file) {
              return res.status(400).json({success:false, error: 'No file uploaded.' });
            }
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic'];
            const id = req.userId;
            const { originalname, buffer, mimetype } = req.file;
            if(allowedMimeTypes.includes(mimetype)){
                
                const compressedImageBuffer = await compressor(buffer);

                const image = new soilDB({
                    farmer_id: id,
                    email: req.email,
                    soil_image:{
                        name:originalname,
                        data:compressedImageBuffer,
                        contentType:mimetype
                    }
                });

                await image.save().then((data)=>{
                    res.json({ success:true,imageurl:'https://sih-2024-orcin.vercel.app/farmer/getimage/soil/' + data._id, message: 'Image uploaded successfully.' });
                }).catch((err)=>{
                        console.log(err);
                        res.status(400).json({
                            success:false,
                            error:err,
                            msg:"something went wrong"
                        });
                });
            
                
        
            }else{
                res.json({ success:false, message: 'Not a png , jpg, heic, or jpeg file.' });
            }
          } catch (error) {
            console.log(error);
            res.status(500).json({success:false, err:error, msg: 'Unsupported image format', });
          }

    },
}

let send = {
    image:async (req, res)=>{
        try {
            const {db, id} = req.params;
            var image;
            if(db == 'soil'){

                image = await soilDB.findById(id);
                if(image){
                    res.set('Content-Type', image.soil_image.contentType);
                    res.send(image.soil_image.data);
                }else{
                    res.status(404).json({success:false, msg:"Image not found"});
                }
            }else if(db == 'image'){
                
                image = await imageDB.findById(id);
                if(image){
                    res.set('Content-Type', image.image.contentType);
                    res.send(image.image.data);
                }else{
                    res.status(404).json({success:false, msg:"Image not found"});
                }
            }else{
                res.status(404).json({success:false, msg:"Invalid database name"});
            }
        } catch (error) {
            res.status(500).json({success:false, err:error, msg: 'Internal Server Error', });
        }
    },
    storeimage : async (req, res) => {
        try {
            if (!req.file) {
              return res.status(400).json({success:false, error: 'No file uploaded.' });
            }
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic'];
            const { originalname, buffer, mimetype } = req.file;
            if(allowedMimeTypes.includes(mimetype)){
                
                const compressedImageBuffer = await compressor(buffer);
    
                const image = new imageDB({
                    refid: req.userId,
                    image:{
                        name:originalname,
                        data:compressedImageBuffer,
                        contentType:mimetype
                    }
                });
    
                await image.save().then((data)=>{
                    res.json({ success:true,imageurl:'https://sih-2024-orcin.vercel.app/farmer/getimage/image/' + data._id, message: 'Image uploaded successfully.' });
                }).catch((err)=>{
                        console.log(err);
                        res.status(400).json({
                            success:false,
                            error:err,
                            msg:"something went wrong"
                        });
                });
            
                
        
            }else{
                res.json({ success:false, message: 'Not a png , jpg, heic, or jpeg file.' });
            }
          } catch (error) {
            console.log(error);
            res.status(500).json({success:false, err:error, msg: 'Unsupported image format', });
          }
    }
}


module.exports = {setup, send};