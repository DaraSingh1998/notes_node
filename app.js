const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
var mongoose=require('mongoose');

const app=express();

const notes=require('./routes/notes');
const users=require('./routes/users');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/notes-dev',{ useNewUrlParser: true })
.then(()=>console.log('MongoDB Connected'))
.catch(err=>console.log(err));

const PORT=3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
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



app.get('/about',(req,res)=>{
  res.render('about',{
    title:'About The App'
  });
});


app.use('/notes',notes);
app.use('/users',users);

app.listen(PORT,()=>{
  console.log(`Server started on port ${PORT}`);
});
