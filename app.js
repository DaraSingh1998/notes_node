const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
var mongoose=require('mongoose');

const app=express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/notes-dev',{ useNewUrlParser: true })
.then(()=>console.log('MongoDB Connected'))
.catch(err=>console.log(err));

const {Note}=require('./models/Note');

const PORT=3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
 app.use(flash());

 // Global Variables
 app.use(function(req,res,next) {
   res.locals.success_msg=req.flash('success_msg');
   res.locals.error_msg=req.flash('error_msg');
   res.locals.error=req.flash('error');
   next();
 });

app.get('/',(req,res)=>{
  res.render('index',{
    title:'Welcome To the note app'
  });
});

app.get('/notes',(req,res)=>{
  Note.find({})
  .sort({date:'desc'})
  .then(notes=>{
    res.render('notes/index',{
      notes:notes
    });
  });
});

app.get('/about',(req,res)=>{
  res.render('about',{
    title:'About The App'
  });
});

app.get('/notes/add',(req,res)=>{
  res.render('notes/add',{
    title:'Add Notes'
  });
});

app.get('/notes/edit/:id',(req,res)=>{
  Note.findOne({
    _id:req.params.id
  })
  .then(note=>{
    res.render('notes/edit',{
      note:note
    });
  });
});

app.post('/notes',(req,res)=>{
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

app.put('/notes/:id',(req,res)=>{
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

app.delete('/notes/:id',(req,res)=>{
  Note.deleteOne({_id:req.params.id})
    .then(()=>{
      req.flash('success_msg','Note Removed');
      res.redirect('/notes');
    });
});

app.listen(PORT,()=>{
  console.log(`Server started on port ${PORT}`);
})
