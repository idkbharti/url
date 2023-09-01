const express = require("express");
const {connectToDb}=require("./connect");
const urlRoute = require("./routes/urlRoutes")
const URL = require("./models/urlSchema")
const cors = require("cors")
const bodyParser = require('body-parser')
const QRCode = require('qrcode-svg');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const qrRoute = require("./routes/qrRoutes")

require('dotenv').config()
const app=express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT=process.env.PORT || 8003;
connectToDb(process.env.DB_URL).then(()=>console.log("sucessfully connect to database"));
app.listen(PORT,()=>console.log(`server running on port ${PORT}`));




cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET, 
  });






app.use('/url',urlRoute);
app.use('/qr',qrRoute);

const storage = multer.memoryStorage();
const upload = multer();

    app.post('/upload', upload.single('file'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'File not provided' });
            }
            console.log(req.body)

    
            // Upload the file to Cloudinary
            const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
            // console.log(cloudinaryResponse,req.body,req.file)
    
            // Generate QR code SVG from the Cloudinary URL
            const qr = new QRCode({
                content: cloudinaryResponse.url,
                padding: 4,
                width: 400,
                height: 400,
            });
    
            // Send the QR code SVG as response
            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(qr.svg());
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'An error occurred' });
        }
    });
    app.get("/",(req,res)=>{
        res.send({message:"hii from server"})
    })


