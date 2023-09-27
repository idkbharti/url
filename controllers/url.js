const {nanoid} = require("nanoid");
const URL = require("../models/url");

async function handleGenrateNewShortURL(req,res){
   const body=req.body
   if(!body.url) return res.status(400).json({error:"url is required"})
   const shortID=nanoid(8);

  //  console.log(body.url)

   await URL.create({
    shortId:shortID,
    redirectUrl:body.url,
    visitHistory:[],
   })

   return res.json({id:shortID})
}

async function handleGetAnalytics(req,res){
const shortID = req.params.shortId;
const result = await URL.findOne({shortId:shortID})
return res.json({
    totalClicks:result.visitHistory.length,
    analytics:result.visitHistory,
})
}

module.exports={
    handleGenrateNewShortURL,
    handleGetAnalytics
}