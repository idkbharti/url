const express = require("express");
const { handleQRGenerator } = require("../controllers/qr");


const router = express.Router()
router.post("/",handleQRGenerator)


module.exports=router;