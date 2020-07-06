require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs= require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true,
  useUnifiedTopology: true});
const usersSchema=new mongoose.Schema({
  email:String,
  password:String
});

const secret=process.env.SECRET;

usersSchema.plugin(encrypt,{secret: secret,encryptedFields: ['password']});

const User=new mongoose.model("User",usersSchema);

app.get("/",function(re,res){
  res.render("home");
});

app.get("/login",function(re,res){
  res.render("login");
});
app.get("/register",function(re,res){
  res.render("register");
});

app.post("/register",function(req,res){
const email=req.body.username;
const password=req.body.password;
const user=new User({
  email:email,
  password:password
});
user.save(function(err){
if(err)
{
  console.log(err);
}
else
{
  res.render("secrets");
}

});


});

app.post("/login",function(req,res){
const username=req.body.username;
const password=req.body.password;
User.findOne({email:username},function(err,object){
if(!err)
{
if(object)
{
  if(object.password==password)
  {
    res.render("secrets");
  }
}

}

});


});








app.listen(3000,function(){
  console.log("Server started on port 3000");
});
