const QRCode = require('qrcode-svg');


// const cf = new cloudflare({
//     email: 'your-email@example.com', // Your Cloudflare email
//     key: 'your-api-key', // Your Cloudflare API key
//   });

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
      // Upload the file to Cloudflare
      const { buffer, originalname } = req.file;
      const uploadResponse = await cf.upload(buffer, { filename: originalname });
  
      // Get the Cloudflare URL of the uploaded file
      const cloudflareUrl = uploadResponse.url;
  
      // Generate a QR code SVG from the Cloudflare URL
      const qrSvg = qr.imageSync(cloudflareUrl, { type: 'svg' });
  
      // Send the QR code SVG to the user as a response
      res.set('Content-Type', 'image/svg+xml');
      res.send(qrSvg);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  
}



module.exports={
    handleQRGenerator,
    handleUploadqrGenerator
}