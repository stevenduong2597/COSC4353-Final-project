const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({

    id: String,
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    zipcode: {
        type:String,
        required:true,
    },
    address: {
        type:String,
        required:true,
    },
    city: {
        type:String,
        required:true,
    },
    state: {
        type:String,
        required:true,
    },
    user_name: {
        type:String,
        required:true,
    },
    cardNumber: {
        type:String,
        required:false,
    },
    cardExp: {
        type:String,
        required:false,
    },
    password: {
        type:String,
        required:false,
    }
})

module.exports=mongoose.model("User",userSchema)
