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
        // users.push({
        //     id: Date.now().toString(),
        //     name: req.body.name,
        //     email: req.body.email,
        //     zipcode:req.body.zipcode,
        //     adress:req.body.adress,
        //     city:req.body.city,
        //     state:req.body.state,
        //     username:req.body.user_name,
        //     password: hashedPassword,
        // })

        const nUser = await User.create({
            //id:Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            zipcode:req.body.zipcode, 
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            username:req.body.user_name,
            password:hashedPassword
        })
        await nUser.save()
        //console.log(users);//display newly registed users
        //console.log(nUser);
        res.redirect("/login")
    }catch(e){
        console.log(e);
        res.redirect("/register")
    }
})

//routes

//renders the dashboard,login,and register pages
app.get('/dashboard',checkAuthenticated,(req,res)=>{
    //console.log("User name is: " + req.session.passport.user);
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

const getCurrentUserId = (req) => {
    if (!req.user) {
      return null; // or throw an error if you want to handle it differently
    }
    return mongoose.Types.ObjectId(req.user.id);
  };

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

app.get('/login',checkNotAuthenticated, (req, res)=>{

    res.render("login.ejs")

})

app.get('/register',checkNotAuthenticated,(req,res)=>{
    res.render("register.ejs")
})

//fuel quote
//fuel quote
var localID = "";


app.get("/items", (req, res) => {

    runAd();
    async function runAd(){
        
        localID = req.session.passport.user;
        const temp2 = await User.findById(localID);
        
        if(temp2 == null){
            return;
        }

        res.status(200).json({

            state: temp2.state,
            address: temp2.address,
            clientID: temp2._id.toString()

        });
    }
});




//pricing module
app.post("/pricing", (req, res) => {

    runAd();
    async function runAd(){

        let galFactor;
        if(req.body.requested > 1000)
            galFactor = 0.02;
        else    
            galFactor = 0.03;

        let locFactor;
        
        if(req.body.state.trim() == 'TX' || req.body.state.trim() == 'Texas')
            locFactor = 0.02;
        else   
            locFactor = 0.04;

        let hisFactor;
        const exists = await History.exists({clientID: req.body.ID});
        if(exists != null)
            hisFactor = 0.01;
        else   
            hisFactor = 0;

        let margin = (galFactor + locFactor - hisFactor + 0.1) * 1.50;
        let suggested = margin + 1.50;
        suggested = suggested.toFixed(3);
        let total = "$" + (req.body.requested * suggested).toFixed(3);
        suggested = "$" + suggested;

        res.json({
            suggested: suggested,
            total: total
        })

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
            suggested: req.body.suggested,
            total: req.body.total
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