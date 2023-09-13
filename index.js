const express = require("express");
const { connectToDb } = require("./connect");
const urlRoute = require("./routes/urlRoutes");
const URL = require("./models/urlSchema");
const cors = require("cors");
const bodyParser = require("body-parser");
const QRCode = require("qrcode-svg");
const qrRoute = require("./routes/qrRoutes");
const s3 = require("./aws-config");

require("dotenv").config();
connectToDb(process.env.DB_URL).then(() =>
  console.log("sucessfully connect to database")
);
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8003;

app.use("/url", urlRoute);
app.use("/qr", qrRoute);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
