const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mini_project')


const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    DOB:Date
})

const User=mongoose.model('User',userSchema);
module.exports=User;