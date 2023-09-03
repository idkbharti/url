const express = require("express");
const {connectToDb}=require("./connect");
const urlRoute = require("./routes/urlRoutes")
const URL = require("./models/urlSchema")
const cors = require("cors")
const bodyParser = require('body-parser')
const QRCode = require('qrcode-svg');
const multer = require('multer');
const qrRoute = require("./routes/qrRoutes")
const { google } = require('googleapis')
const stream = require('stream')

require('dotenv').config()
const app=express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT=process.env.PORT || 8003;
connectToDb(process.env.DB_URL).then(()=>console.log("sucessfully connect to database"));

const upload = multer({ storage: multer.memoryStorage() });

app.use('/url',urlRoute);
app.use('/qr',upload.single('file'),qrRoute);

const credentials = require('C:/Users/idkbh/OneDrive/Desktop/Apps/url/keys.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  credentials.redirect_uris[0]
);

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

// Handle OAuth 2.0 authorization
app.get('/auth', (req, res) => {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authorizeUrl);
});

// Handle OAuth 2.0 callback
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send('Authentication successful. You can now upload files.');
  } catch (error) {
    console.error('Error authenticating:', error);
    res.status(500).send('Authentication error');
  }
});

// Define a route for file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileStream = new stream.PassThrough();
    fileStream.end(req.file.buffer);
    
    const media = {
      mimeType: req.file.mimetype, // Set the correct MIME type for the uploaded file
      body: fileStream, // Use the readable stream
    };
    
    const response = await drive.files.create({
      media,
      requestBody: {
        name: req.file.originalname, // Use the original file name
      },
    });

    console.log('File uploaded to Google Drive:', response.data);

    // Generate a QR code using qrcode-svg
    const qr = new QRCode({
      content: response.data.webViewLink,
      padding: 4,
      width: 200, // Adjust width as needed
      height: 200, // Adjust height as needed
      color: '#000000',
      background: '#ffffff',
    });

    // Send the QR code SVG as a response
    res.set('Content-Type', 'image/svg+xml');
    res.send(qr.svg());
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    res.status(500).send('Error uploading file to Google Drive');
  }
});




app.listen(PORT,()=>console.log(`server running on port ${PORT}`));



