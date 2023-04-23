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

// Schemas 
const User = require("./Users")
const History = require("./history");
const Client = require("./client");

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

const users =[]

app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,//we wont resave the session var if nothing changes
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use('/css', express.static(__dirname + 'public/css'));


//configure the login post functionality
//logins in users
app.post("/login",checkNotAuthenticated,passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
}))



//configure the register post functionality
//registers users
app.post("/register", checkNotAuthenticated, async (req,res)=>{
    try{
        //we already hashed the password in backend using bcyrpt
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            zipcode:req.body.zipcode,
            adress:req.body.adress,
            city:req.body.city,
            state:req.body.state,
            username:req.body.user_name,
            password: hashedPassword,
        })

        const nUser = await User.create({
            id:Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            zipcode:req.body.zipcode, 
            adress:req.body.adress,
            city:req.body.city,
            state:req.body.state,
            username:req.body.user_name,
            password:hashedPassword
        })
        await nUser.save()
        console.log(users);//display newly registed users
        console.log(nUser);
        res.redirect("/login")
    }catch(e){
        console.log(e);
        res.redirect("/register")
    }
})

//routes

//renders the dashboard,login,and register pages
app.get('/dashboard',checkAuthenticated,(req,res)=>{
    res.render("dashboard.ejs", {name: req.user.name})
})
//homepage
app.get('/', (req, res) => {

    res.render('index.ejs');

} );
//history
app.get("/history", (req, res) => {

    res.render("history.ejs");

} );
//settings

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


app.post("/setting", (req, res)=>{
    if (req.body.fullName){

        const doc = User.findOneAndUpdate(
            { name: req.body.fullName},
            { new: true }
          );
        console.log(doc);

        //User.updateOne({id: 1}, {$set: {full_name: req.body.fullName}});
    }
    if (req.body.userEmail){
        User.updateOne({id: 1}, {$set: {email: req.body.userEmail}});
    }
    if (req.body.address){
        User.updateOne({id: 1}, {$set: {address: req.body.address}});
    }
    if (req.body.city){
        User.updateOne({id: 1}, {$set: {city: req.body.city}});
    }
    if (req.body.state){
        User.updateOne({id: 1}, {$set: {state: req.body.state}});
    }
    if (req.body.zipCode){
        User.updateOne({id: 1}, {$set: {zipcode: req.body.zipCode}});
    }
    if (req.body.userName){
        User.updateOne({id: 1}, {$set: {userName: req.body.userName}});
    }
    if (req.body.password){
        User.updateOne({id: 1}, {$set: {password: req.body.password}});
    }
    if (req.body.cardNumber){
        User.updateOne({id: 1}, {$set: {cardNumber: req.body.cardNumber}});
    }
    if (req.body.expirationDate){
        User.updateOne({id: 1}, {$set: {cardExp: req.body.expirationDate}});
    }
    if (req.body.cvv){
        User.updateOne({id: 1}, {$set: {cvv: req.body.cvv}});
    }
    
    res.redirect("setting");

});

app.get('/login',checkNotAuthenticated, (req, res)=>{

    res.render("login.ejs")

})

app.get('/register',checkNotAuthenticated,(req,res)=>{
    res.render("register.ejs")
})

//fuel quote
var localID = "642a06397c9a94d473a56eb6";


app.get("/items", (req, res) => {

    runAd();
    async function runAd(){

        const temp2 = await Client.findById(localID);
        
        if(temp2 == null){
            return;
        }

        res.status(200).json({

            address: temp2.address,
            clientID: temp2.id

        });

    }
});


//was dashboard
app.post('/dashboard', (req, res) => {

    run();
    async function run(){

        const hist = new History({
            clientID: req.body.clientID,
            requested: req.body.gallons,
            address: req.body.address,
            date: req.body.date,
            suggested: "$300",
            total: "$" + parseInt(300 * req.body.gallons)
        });
    
        await hist.save();
    
    }

    localID = req.body.clientID;

});

gallons = [];
address = [];
date = [];
suggested = [];
total = [];


app.get("/info", (req, res) => {

    var historyLength;

    runQuery();
    async function runQuery(){

        const temp = await History.find({clientID: localID});

        let historyLength = temp.length;

        for(let x = 0; x < historyLength; x++){
            gallons.push(temp[x].requested);
            address.push(temp[x].address);
            date.push(temp[x].date);
            suggested.push(temp[x].suggested);
            total.push(temp[x].total);
        }

    }


    res.status(200).json({
        
        clientID: localID,
        gallons: gallons,
        address: address,
        date: date,
        suggested: suggested,
        total: total

    });

    gallons = [];
    address = [];
    date = [];
    suggested = [];
    total = [];

} );




//end routes
//logout
app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/dashboard")
    })
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/dashboard")
    }
    next()
}
app.listen(3000)