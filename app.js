const express = require('express');
const exphbs  = require('express-handlebars');
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

app.get('/notes',(req,res)=>{
  res.render('notes',{
    title:'Your Notes'
  });
});

app.listen(PORT,()=>{
  console.log(`Server started on port ${PORT}`);
})
