//jshint esversion:6
require('dotenv').config();
const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const mongoose=require('mongoose')
const encrypt=require('mongoose-encryption')

const app=express()
mongoose.connect('mongodb://127.0.0.1:27017/userDB', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(express.static("public"))

app.set('view engine','ejs')

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=mongoose.model("User",userSchema)

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save().then(()=>{
            res.render("secrets")
    })
})

app.post("/login",(req,res)=>{
    const username=req.body.username
    const password=req.body.password

    User.findOne({email:username}).then(foundUser=>{
        if(foundUser){
            if(foundUser.password===password){
                res.render("secrets");
            }
        }
        else{
            console.log("not a user")
        }
    })
})

app.listen(3000,()=>{
    console.log("Server started on port 3000.")
})