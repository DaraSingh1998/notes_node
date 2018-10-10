const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
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

app.get('/',(req,res)=>{
  res.render('index',{
    title:'Welcome To the note app'
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
    res.send('Passed');
  }
});

app.listen(PORT,()=>{
  console.log(`Server started on port ${PORT}`);
})
