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

//*Restructuring routes
const listings=require('./routes/listing');
const reviews=require('./routes/review');
const { secureHeapUsed, createSecretKey } = require('crypto');

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

app.get('/',(req,res)=>
    {
        res.send('Welcome to the project!!');
    });

    
app.use(session(sessionOptions));
app.use(flash());//*Flash

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    //console.log(res.locals.success);
    next();
});

//! lisitng routes
app.use('/listings',listings);

//!reviews routes
app.use('/listings/:id/reviews',reviews);

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