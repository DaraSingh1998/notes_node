const express = require('express');
const router=express.Router();
const {Note}=require('../models/Note');

router.get('/',(req,res)=>{
  Note.find({})
  .sort({date:'desc'})
  .then(notes=>{
    res.render('notes/index',{
      notes:notes
    });
  });
});

router.get('/add',(req,res)=>{
  res.render('notes/add',{
    title:'Add Notes'
  });
});

router.get('/edit/:id',(req,res)=>{
  Note.findOne({
    _id:req.params.id
  })
  .then(note=>{
    res.render('notes/edit',{
      note:note
    });
  });
});

router.post('/',(req,res)=>{
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
      details:req.body.details
    }
    new Note(newUser)
    .save()
    .then(note=>{
      req.flash('success_msg','Note Added');
      res.redirect('/notes');
    });
  }
});

router.put('/:id',(req,res)=>{
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

router.delete('/:id',(req,res)=>{
  Note.deleteOne({_id:req.params.id})
    .then(()=>{
      req.flash('success_msg','Note Removed');
      res.redirect('/notes');
    });
});

module.exports=router;
