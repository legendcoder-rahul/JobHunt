const mongoose = require("mongoose");

const connectToDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
         .then(()=>{
             console.log('connected to database');
         })
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectToDb