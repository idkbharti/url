const express = require("express");
const {connectToDb}=require("./connect");
const multer = require('multer');
// const urlRoute = require("./routes/urlRoutes")
// const URL = require("./models/urlSchema")
// const { createCanvas } = require('canvas');
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

// Google Drive API setup
// const credentials = require('./path/to/your/client_secret.json'); // Path to your downloaded client secret JSON file
// const oauth2Client = new google.auth.OAuth2(
//     credentials.installed.client_id,
//     credentials.installed.client_secret,
//     credentials.installed.redirect_uris[0]
// );
// const drive = google.drive({ version: 'v3', auth: oauth2Client });

connectToDb("mongodb+srv://idkbharti:AAxZum0QBueMaehp@cluster0.i1zihkv.mongodb.net/").then(()=>console.log("sucessfully connect to database"));

app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// app.use("/url",urlRoute)

// Handle file upload and return QR code with URL
// app.post('/uploadAndGenerateQR', async (req, res) => {
//     const { file } = req.body;

//     // Upload the file to Google Drive
//     const driveResponse = await drive.files.create({
//         requestBody: {
//             name: file.originalname,
//             mimeType: file.mimetype,
//             parents: ['YOUR_FOLDER_ID'] // Set the folder ID where you want to upload the file
//         },
//         media: {
//             mimeType: file.mimetype,
//             body: file.buffer
//         }
//     });

//     // Generate QR code with the file URL
//     const fileUrl = driveResponse.data.webViewLink; // You might need to adjust this based on the Drive API response
//     const qr = new QRCode({
//         content: fileUrl,
//         padding: 4,
//         width: 300,
//         height: 300,
//         color: '#000000',
//         background: '#ffffff'
//     });

//     // Send the QR code SVG as response
//     res.setHeader('Content-Type', 'image/svg+xml');
//     res.send(qr.svg());
// });

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

