if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

// referenced https://www.youtube.com/watch?v=c6zI1gCaO-c 

//importing libraries that we installed with npm
const express = require("express")
const app = express()

//login module
const bcrypt = require("bcrypt")//importing bycrpt packages
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
//const ejs = require('ejs')
const methodOverride= require("method-override")
const mongoose =require('mongoose')
const bodyParser = require("body-parser");
// Schemas 
const User = require("./Users")

//mongoose
mongoose.connect("mongodb://0.0.0.0:27017/PetrolPricer")
app.set('view engine', 'ejs');



//function that will authenticate users from db
initializePassport(
    passport,
    //email => users.find(user=>user.email === email),
    //id => users.find(user =>user.id===id),
    //email => getmail(email),
    //id => getmailid(id)
    )

//const users =[]

app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,//we wont resave the session var if nothing changes
    saveUninitialized: false
}))

app.use(express.json());
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
//app.use(express.urlencoded({extended: false}));



app.get("/setting", (req, res)=>{
    const userID = req.session.passport.user.toString();
   // const currentUser = Parse.User.current();
   // console.log("User: " + currentUser.get("id"));
   //console.log(req.session.passport.user)
   console.log(userID);
   User.findOne({_id: userID}).then(function(usersdata){
       let temp = usersdata;
       //console.log(temp);
       res.render("setting", 
       {fullName: temp.name, 
       userEmail: temp.email,
       userName: temp.user_name,
       address: temp.address,
       city: temp.city,
       state: temp.state,
       zipCode: temp.zipcode,
       cardNumber: temp.cardNumber,
       expirationDate: temp.cardExp,
       cvv: temp.cvv,
       }
       );
       
   });
});


app.post("/setting", async (req, res)=>{
   const userID = req.session.passport.user.toString();
   if (req.body.fullName){
       User.updateOne({_id: userID}, {name : req.body.fullName.trim()}).then(()=>{
           console.log("Successfully updated !");
       })
   }
   if (req.body.userEmail){
       User.updateOne({_id: userID}, {email : req.body.userEmail.trim()}).then(()=>{
           console.log("Successfully updated !");
       })
   }
   if (req.body.address){
       User.updateOne({_id: userID}, {address: req.body.address.trim()}).then(()=>{
           console.log("Successfully updated !");
       });
   }
   if (req.body.city){
       User.updateOne({_id: userID}, {city: req.body.city.trim()}).then(()=>{
           console.log("Successfully updated !");
       });
   }
   if (req.body.state){
       User.updateOne({_id: userID}, {state: req.body.state.trim()}).then(()=>{
           console.log("Successfully updated !");
       });
   }
   if (req.body.zipCode){
       User.updateOne({_id: userID}, {zipcode: req.body.zipCode.trim()}).then(()=>{
           console.log("Successfully updated !");
       });
   }
   if (req.body.userName){
       User.updateOne({_id: userID}, {user_name: req.body.userName.trim()}).then(()=>{
           console.log("Successfully updated !");
       });
   }
   if (req.body.newPassword){
       const hashedPassword = await bcrypt.hash(req.body.newPassword,10);
       User.updateOne({_id: userID}, {password: hashedPassword}).then(()=>{
           console.log("Successfully updated !");
       });
   }
   if (req.body.cardNumber){
       User.updateOne({_id: userID}, {cardNumber: req.body.cardNumber.trim()}).then(()=>{
           console.log("Successfully updated !");
       });
   }
   if (req.body.expirationDate){
       User.updateOne({_id: userID}, {cardExp: req.body.expirationDate.trim()}).then(()=>{
           console.log("Successfully updated !");
       });
   }
   if (req.body.cvv){
       User.updateOne({_id: userID}, {cvv: req.body.cvv.trim()}).then(()=>{
           console.log("Successfully updated !");
       });
   }
   
   res.redirect("setting");

});


app.listen(3000, () => {console.log("Server's running on port 3000")});
