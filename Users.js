const mongoose = require("mongoose")
// const purchase = require("./history")


// const historySchema = purchase.historySchema()


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
        required:false,
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
        required:false,
    },
    cardNumber: {
        type:String,
        required:false,
    },
    cardExp: {
        type:String,
        required:false,
    },
    cvv: {
        type:Number,
        required:false,
    },
    password: {
        type:String,
        required:true,
    },
    // history: {
    //     requested: Number,
    //     address: String,
    //     date: String,
    //     suggested: String,
    //     total: String
    // }
})

module.exports=mongoose.model("User",userSchema)