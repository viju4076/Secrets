require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs= require("ejs");
const mongoose=require("mongoose");
//const encrypt=require("mongoose-encryption");
//const md5=require("md5");
const bcrypt=require("bcrypt");
const saltRounds=10;
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

//usersSchema.plugin(encrypt,{secret: secret,encryptedFields: ['password']});

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
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const email=req.body.username;
    const user=new User({
      email:email,
      password:hash
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




});

app.post("/login",function(req,res){
const username=req.body.username;
const password=req.body.password;
User.findOne({email:username},function(err,object){
if(!err)
{
if(object)
{
  bcrypt.compare(password, object.password, function(err, result) {
    // result == true
    if(result==true){
        res.render("secrets");
      }
});
}

}

});


});








app.listen(3000,function(){
  console.log("Server started on port 3000");
});
