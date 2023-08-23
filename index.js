const express = require("express");
const {connectToDb}=require("./connect");
const urlRoute = require("./routes/urlRoutes")
const URL = require("./models/urlSchema")

const app=express();
const PORT=8001;

connectToDb("mongodb+srv://idkbharti:AAxZum0QBueMaehp@cluster0.i1zihkv.mongodb.net/").then(()=>console.log("sucessfully connect to database"));

app.use(express.json());
app.use("/url",urlRoute)

app.listen(PORT,()=>console.log(`server running on port ${PORT}`));


// const express = require('express');
// const mongoose = require('mongoose');
// const { nanoid } = require('nanoid');

// // Create an Express app
// const app = express();

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://idkbharti:AAxZum0QBueMaehp@cluster0.i1zihkv.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Define the URL schema
// const urlSchema = new mongoose.Schema({
//   originalUrl: String,
//   shortId: String,
// });

// const URL = mongoose.model('URL', urlSchema);

// // Function to generate a unique short URL
// async function generateShortUrl() {
//   let isUnique = false;
//   let shortUrl;

//   while (!isUnique) {
//     shortUrl = 'short' + nanoid(8); // Concatenate 'short' with 8 random characters
//     const existingUrl = await URL.findOne({ shortId: shortUrl }).exec();

//     if (!existingUrl) {
//       isUnique = true;
//     }
//   }

//   return shortUrl;
// }

// // Endpoint to create a short URL
// app.post('/shorten', async (req, res) => {
//   try {
//     const originalUrl = req.body.originalUrl; // Assuming the original URL is sent in the request body
//     const shortId = await generateShortUrl();

//     const newUrl = new URL({
//       originalUrl,
//       shortId,
//     });

//     await newUrl.save();

//     res.json({ shortUrl: shortId });
//   } catch (error) {
//     console.error(error); // Log the error
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
