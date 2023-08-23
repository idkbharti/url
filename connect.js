const mongoose = require("mongoose");
mongoose.set("strictQuery",true);

async function connectToDb(url){
    return mongoose.connect(url);
}

module.exports={connectToDb};