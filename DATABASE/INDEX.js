const mongoose = require("mongoose");
 const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("mongoose connected")
    }catch(error) {
        console.log("mongooes not connected", error)
        throw error;
    }
    }
    module.exports=connect
 