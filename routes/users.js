const express = require('express');
const router=express.Router();
const {Note,User}=require('../models/User');


router.get('/login',(req,res)=>{
  res.render('users/login');
});

router.get('/register',(req,res)=>{
  res.render('users/register');
});

router.post('/register',(req,res)=>{
  let errors=[];
  if(req.body.password!=req.body.password2){
    errors.push({text:'Passwords do not match'});
  }
  if (req.body.password.length <7) {
    errors.push({text:'Password length should be minimum 7'});
  }
  if (errors.length>0) {
    res.render('users/register',{
      errors:errors,
      name:req.body.name,
      email:req.body.email
    });
  }else {
    res.send('Passed');
  }
});

module.exports=router;
