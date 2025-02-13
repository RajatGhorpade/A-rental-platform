const express=require('express');
const app =express();
const mongoose=require('mongoose');
//const Listing=require('./models/listing');
const path = require('path');
const methodOverride= require('method-override');
const ejsMate=require('ejs-mate');
//const wrapAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');
//const{listingSchema}=require('./schema');
//const Review=require('./models/review');
//const {reviewSchema}=require('./schema');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

//*enviroment varaibles
if(process.env.NODE_ENV!=='production')
{
    require('dotenv').config();
}


//*Restructuring routes
const listingRouter=require('./routes/listing');
const reviewRouter=require('./routes/review');
const userRouter=require('./routes/user');

//*ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true})); //? middleware
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'public')));

//*connecting to mongodb
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
main()
    .then(()=>
    {
        console.log('connected to Database!');
    })
    .catch((err)=>
    {
        console.log(err);
    });

async function main()
{
    await mongoose.connect(MONGO_URL);
};


//*A sample data element to check working
/*app.get('/testListing',async (req,res)=>
{
    let sampleListing = new Listing
    ({
        title:"My new Villa",
        description : "by the beach",
        price:1200,
        location:'Mangalore',
        country:'India',
    });
   await sampleListing.save();
   console.log('sample was saved');
   res.send('successful testing');
});*/

//*Session
const sessionOptions=
{
    secret:'mysupersecretcode',
    resave:false,
    saveUninitialized:true,
    cookie:
    {
        expires:Date.now() + 7*24*60*60*1000, //setting expiry date of 7days
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

/*app.get('/',(req,res)=>
    {
        res.send('Welcome to the project!!');
    });*/

    
app.use(session(sessionOptions));
app.use(flash());//*Flash

//*passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//*using flash
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    //console.log(res.locals.success);
    next();
});

//* demo user and route for authentication
/*app.get('/demouser',async(req,res)=>
{
    let fakeUser=new User
    ({
        email:'student@gmail.com',
        username:'student',
    });
    let registeredUser = await User.register(fakeUser,'password');
    res.send(registeredUser);
});*/


//! lisitng routes
app.use('/listings',listingRouter);
//!reviews routes
app.use('/listings/:id/reviews',reviewRouter);
//!user routes
app.use('/',userRouter);

//!Error middleware
app.all('*',(req,res,next)=>
{
    next(new ExpressError(404,'Page not found!!!'));
});

app.use((err,req,res,next)=>
{
    let{statusCode=500,message='Something went wrong!!'}=err;
    res.render('error.ejs',{message});
    //res.status(statusCode).send(message);
    //res.send('something went wrong!!');
});


app.listen(8080,()=>
    {
        console.log('server is listening to port 8080');
    }
    );