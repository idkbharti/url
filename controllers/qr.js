const QRCode = require('qrcode-svg');
const s3 = require('../aws-config');


async function handleQRGenerator(req,res){
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

}

async function handleUploadqrGenerator(req,res){
    try {
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded.' });
        }
    
        const { originalname, buffer } = req.file;
        // console.log(req.file)
        
        // Upload the file to Amazon S3
        const params = {
          Bucket: 'snapurl',
          Key: originalname,
          Body: buffer,
        };
    
        const url = await s3.upload(params).promise();
        // console.log(url)
    
        // Generate the QR code
        const param = {
          Bucket: 'snapurl',
          Key: originalname,
        };
    
        const signedUrl = s3.getSignedUrl('getObject', param);
      //  console.log(signedUrl)
        // Generate the QR code for the signed URL
        const qr = new QRCode(signedUrl);
    
        // Send the QR code as an SVG response
        res.type('svg');
        res.send(qr.svg());
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
  
}



module.exports={
    handleQRGenerator,
    handleUploadqrGenerator
}