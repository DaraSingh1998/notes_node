const mongoose = require('mongoose');
const Schema=mongoose.Schema;


const NotesSchema=new Schema({
  title:{
    type:String,
    required:true
  },
  details:{
    type:String,
    required:true,
  },
  user:{
    type:String,
    required:true,
  },
  date:{
    type:Date,
    default:Date.now
  }
});
const Note=mongoose.model('Note',NotesSchema);

module.exports={
  Note
};
