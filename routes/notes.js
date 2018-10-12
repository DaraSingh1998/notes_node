const express = require('express');
const router=express.Router();
const {User,Note}=require('../models/Note');
const {ensureAuthenticated}=require('../helper/auth');

router.get('/',ensureAuthenticated,(req,res)=>{
  Note.find({user:req.user.id})
  .sort({date:'desc'})
  .then(notes=>{
    res.render('notes/index',{
      notes:notes
    });
  });
});

router.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('notes/add',{
    title:'Add Notes'
  });
});

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
  Note.findOne({
    _id:req.params.id
  })
  .then(note=>{
    if (note.user!=req.user.id) {
      req.flash('error_msg','Not Authorized');
      res.redirect('/notes');
    }else {
      res.render('notes/edit',{
        note:note
      });
    }
  });
});

router.post('/',ensureAuthenticated,(req,res)=>{
  let err=[];
  if(!req.body.title_form){
  err.push({text:'Please enter the title'});
  }
  if(!req.body.details){
  err.push({text:'Please enter the deatails'});
  }
  if(err.length>0){
    res.render('notes/add',{
      errors:err,
      title_form:req.body.title_form,
      details:req.body.details
    });
  }
  else{
    const newUser={
      title:req.body.title_form,
      details:req.body.details,
      user:req.user.id
    }
    new Note(newUser)
    .save()
    .then(note=>{
      req.flash('success_msg','Note Added');
      res.redirect('/notes');
    });
  }
});

router.put('/:id',ensureAuthenticated,(req,res)=>{
  Note.findOne({
    _id:req.params.id
  })
  .then(note=>{
    note.title=req.body.title;
    note.details=req.body.details;
    note.save()
      .then(note=>{
        req.flash('success_msg','Note Updated');
        res.redirect('/notes');
      });
  });
});

router.delete('/:id',ensureAuthenticated,(req,res)=>{
  Note.deleteOne({_id:req.params.id})
    .then(()=>{
      req.flash('success_msg','Note Removed');
      res.redirect('/notes');
    });
});

module.exports=router;
