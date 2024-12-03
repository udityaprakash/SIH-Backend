const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({
    storage
});

async function compressor(buffer){
    const compressedImageBuffer = await sharp(buffer)
          .resize({ width: 500 })
          .toBuffer();
    return compressedImageBuffer;      
}

module.exports = { upload, compressor} ;