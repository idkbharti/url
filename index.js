const express = require("express");
const {connectToDb}=require("./connect");
const multer = require('multer');
const fetch = require('node-fetch');
const { Dropbox } = require('dropbox');
// const urlRoute = require("./routes/urlRoutes")
// const URL = require("./models/urlSchema")
const QRCode = require('qrcode-svg');
const fs = require('fs');
const path = require('path');
// const cloudinary = require('cloudinary').v2;
const cors = require("cors")
const bodyParser = require('body-parser')
const { google } = require('googleapis');

const app=express();
const PORT=8001;
// cloudinary.config({ 
//     cloud_name: 'drsb7nvju', 
//     api_key: '275482564314283', 
//     api_secret: 'U7kctLgzbL2Uj3dSRWO8Su3qTX0' 
//   });



connectToDb("mongodb+srv://idkbharti:AAxZum0QBueMaehp@cluster0.i1zihkv.mongodb.net/").then(()=>console.log("sucessfully connect to database"));

app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const dropbox = new Dropbox({ accessToken: 'dqxjy40mv6lt51x' });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File not provided' });
        }

        // Upload the file to Dropbox
        const response = await dropbox.filesUpload({
            path: '/' + req.file.originalname,
            contents: req.file.buffer,
        });

        // Get the shared link
        const sharedLink = await dropbox.sharingCreateSharedLinkWithSettings({
            path: response.path_display,
        });

        // Generate QR code SVG from the shared link
        const qr = new QRCode({
            content: sharedLink.url,
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
})


app.post('/generateQR', 
// upload.single('file'),
 (req, res) => {
    const { type, content } = req.body;

    let qrText = '';
    switch (type) {
        case 'Text':
            qrText = content;
            break;
        case 'SMS':
            qrText = `SMSTO:${content}`;
            break;
        case 'Email':
            qrText = `mailto:${content}`;
            break;
        case 'Url':
            qrText = content;
            break;
        case 'Wifi':
            const { ssid, password, isHidden } = content;
            // console.log(content,ssid,password,isHidden)
            const securityType = password ? 'WPA' : 'nopass';
            qrText = `WIFI:T:${securityType};S:${ssid};P:${password};;${isHidden ? 'H:true' : ''};`;
            break;
        // case 'pdf':
        //     if (req.file) {
        //         // Generate QR code for the uploaded PDF file
        //         qrText = req.file.buffer.toString('base64');
        //     } else {
        //         res.status(400).send('PDF file is required');
        //         return;
        //     }
        //     break;
        default:
            res.status(400).send('Invalid type');
            return;
    }

    const qr = new QRCode({
    content: qrText,
    padding: 4,
    width: 200, // Increase the width
    height: 200, // Increase the height
    color: '#000000',
    background: '#ffffff'
    });

    // Send the QR code SVG as response
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(qr.svg());
});



  

app.listen(PORT,()=>console.log(`server running on port ${PORT}`));

