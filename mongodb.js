require('dotenv').config();
const mongoose = require('mongoose')

const connect = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_DB)
        console.log('MongoDB Connected')
    }catch(err){
        console.log(`MongoDB Connection Failed: ${err.message}`)
    }
}

module.exports = connect