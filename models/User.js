const mongoose = require('mongoose');
const Schema=mongoose.Schema;


const UsersSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    default:Date.now
  }
});
const User=mongoose.model('User',UsersSchema);

module.exports={
  User
};
