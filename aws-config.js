const AWS = require("aws-sdk");
// const {s3Client,GetObjectCommand} = require('@aws-sdk/client-s3')
// const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")

require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1", // Modify this to your bucket's region
});

const s3 = new AWS.S3();

module.exports = s3;
