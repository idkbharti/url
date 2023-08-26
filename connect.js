const mongoose = require("mongoose");
mongoose.set("strictQuery",true);

async function connectToDb(url){
    return mongoose.connect(url, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
        });
}

module.exports={connectToDb};