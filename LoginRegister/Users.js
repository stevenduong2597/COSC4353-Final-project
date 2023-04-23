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
    adress: {
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
        required:true,
    },
    cardExp: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    }
})

module.exports=mongoose.model("User",userSchema)