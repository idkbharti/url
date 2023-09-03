const express = require("express");
const { handleQRGenerator,handleUploadqrGenerator } = require("../controllers/qr");


const router = express.Router()
router.post("/",handleQRGenerator)
router.post("/upload",handleUploadqrGenerator)



module.exports=router;