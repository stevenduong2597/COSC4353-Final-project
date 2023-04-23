//frontend
const bodyParser = require("body-parser");
const express = require("express");
//const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/usersDB");

const usersSchema = new mongoose.Schema ({
    id: Number,
    full_name: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zipcode: Number,
    user_name: String,
    password: String,
    cardNumber: String,
    cardExp: String,
    cvv: Number
});

const User = mongoose.model("User", usersSchema);

const user = new User ({
    id: 1,
    full_name: 'John Deer',
    email: 'John@gmail.com',
    address: '123 Main st.',
    city: 'Houston',
    state: 'TX',
    zipcode: 12345,
    user_name: 'John123',
    password: '123',
    cardNumber: '123456789',
    cardExp: '11/27',
    cvv: 312
})

//user.save();



const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.get("/setting", (req, res)=>{
    User.find().then(function(usersdata){
        let temp = usersdata;
        

        res.render("setting", 
        {fullName: temp[0].full_name, 
        userEmail: temp[0].email,
        userName: temp[0].user_name,
        address: temp[0].address,
        city: temp[0].city,
        state: temp[0].state,
        zipCode: temp[0].zipcode,
        cardNumber: temp[0].cardNumber,
        expirationDate: temp[0].cardExp,
        cvv: temp[0].cvv,
        }
        );
        
    });
});

// async function updateClient(key, value){
//     let newUpdate = await User.updateOne({id: 1}, {key: value});
//     await newUpdate.save();
// }


app.post("/setting", (req, res)=>{
    if (req.body.fullName){
        User.updateOne({id: 1}, {full_name : req.body.fullName}).then(()=>{
            console.log("Successfully updated !");
        })
        console.log(req.body.fullName);
    }
    if (req.body.userEmail){
        User.updateOne({id: 1}, {email : req.body.userEmail}).then(()=>{
            console.log("Successfully updated !");
        })
    }
    if (req.body.address){
        User.updateOne({id: 1}, {address: req.body.address}).then(()=>{
            console.log("Successfully updated !");
        });
    }
    if (req.body.city){
        User.updateOne({id: 1}, {city: req.body.city}).then(()=>{
            console.log("Successfully updated !");
        });
    }
    if (req.body.state){
        User.updateOne({id: 1}, {state: req.body.state}).then(()=>{
            console.log("Successfully updated !");
        });
    }
    if (req.body.zipCode){
        User.updateOne({id: 1}, {zipcode: req.body.zipCode}).then(()=>{
            console.log("Successfully updated !");
        });
    }
    if (req.body.userName){
        User.updateOne({id: 1}, {userName: req.body.userName}).then(()=>{
            console.log("Successfully updated !");
        });
    }
    if (req.body.password){
        User.updateOne({id: 1}, {password: req.body.password}).then(()=>{
            console.log("Successfully updated !");
        });
    }
    if (req.body.cardNumber){
        User.updateOne({id: 1}, {cardNumber: req.body.cardNumber}).then(()=>{
            console.log("Successfully updated !");
        });
    }
    if (req.body.expirationDate){
        User.updateOne({id: 1}, {cardExp: req.body.expirationDate}).then(()=>{
            console.log("Successfully updated !");
        });
    }
    if (req.body.cvv){
        User.updateOne({id: 1}, {cvv: req.body.cvv}).then(()=>{
            console.log("Successfully updated !");
        });
    }
    
    res.redirect("setting");

});


app.listen(3000, () => {console.log("Server's running on port 3000")});
