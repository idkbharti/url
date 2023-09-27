const express = require("express");
const multer = require('multer');
const { handleQRGenerator,handleUploadqrGenerator } = require("../controllers/qr");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router()
router.post("/",handleQRGenerator)
router.post("/upload",upload.single('file'),handleUploadqrGenerator)



module.exports=router;