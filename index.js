const express = require("express");
const {connectToDb}=require("./connect");
const urlRoute = require("./routes/urlRoutes")
const URL = require("./models/urlSchema")
const { createCanvas } = require('canvas');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const cors = require("cors")

const app=express();
const PORT=8001;
cloudinary.config({ 
    cloud_name: 'drsb7nvju', 
    api_key: '275482564314283', 
    api_secret: 'U7kctLgzbL2Uj3dSRWO8Su3qTX0' 
  });

connectToDb("mongodb+srv://idkbharti:AAxZum0QBueMaehp@cluster0.i1zihkv.mongodb.net/").then(()=>console.log("sucessfully connect to database"));

app.use(express.json());
app.use(cors())
app.use("/url",urlRoute)

app.post('/generate-qrcode', async (req, res) => {
    try {
      const { url } = req.body;
  
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
  
      const canvas = createCanvas(300, 300);
      await QRCode.toCanvas(canvas, url);
  
      canvas.toBuffer(async (err, buffer) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'An error occurred' });
        }
  
        try {
          const cloudinaryUploadResult = await cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'qrcodes' },
            async (error, result) => {
              if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
              }
  
              res.json({ qrCodeImageUrl: result.secure_url });
            }
          ).end(buffer);
        } catch (uploadError) {
          console.error(uploadError);
          res.status(500).json({ error: 'Failed to upload to Cloudinary' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  

app.listen(PORT,()=>console.log(`server running on port ${PORT}`));

