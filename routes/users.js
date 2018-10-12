const express = require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport = require('passport');
const {Note,User}=require('../models/User');


router.get('/login',(req,res)=>{
  res.render('users/login');
});

router.get('/register',(req,res)=>{
  res.render('users/register');
});

router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
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
    User.findOne({email:req.body.email})
      .then(user=>{
        if (user) {
          req.flash('error_msg','Email is already registered');
          res.redirect('/users/login');
        }else {
          const newUser=new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
          });
          bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
              if(err) throw err;
              newUser.password=hash;
              newUser.save()
                .then(user=>{
                  req.flash('success_msg','You are now registered and can now login');
                  res.redirect('/users/login');
                })
                .catch((err) => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

module.exports=router;
