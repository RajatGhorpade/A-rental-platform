const express=require('express');
const app =express();
const mongoose=require('mongoose');
const Listing=require('./models/listing');
const path = require('path');
const methodOverride= require('method-override');
const ejsMate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync');
const ExpressError=require('./utils/ExpressError');
const{listingSchema}=require('./schema');

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


app.get('/',(req,res)=>
{
    res.send('Welcome to the project!!');
});

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

//!validations for schema in form of middleware
const validateListing=(req,res,next)=>
{
    let {error}=listingSchema.validate(req.body);
   
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(',');
        //throw new ExpressError(400,error);
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

//!Index route
app.get('/listings',wrapAsync(async(req,res)=>
{
      const allListings= await Listing.find({});
      res.render('listings/index.ejs',{allListings});      
})
);

//!Create new listing
app.get('/listings/new' ,(req,res)=>
    {
        res.render('listings/new.ejs');
    });
    

//!Show Route
app.get('/listings/:id',wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('listings/show.ejs',{listing});
})
);

//!Create route after creating new listing
app.post('/listings',validateListing, wrapAsync(async(req,res,next)=>
{
        /*if(!req.body.listing)
        {
            throw new ExpressError(400,'Send valid data for listing');   
        }*/
       //let{title,description,image,price,country,location}=req.params;
        //?Schema validation instead of below multiple if statements
        /*let result=listingSchema.validate(req.body);
        console.log(result);
        if(result.error)
        {
            throw new ExpressError(400,result.error);
        }*/

        const newListing= new Listing(req.body.listing);
        //?handling errors if anyone paramter is missing
        /*if(!newListing.title)
        {
            throw new ExpressError(400,'Title is missing!');
        }
        if(!newListing.description)
        {
            throw new ExpressError(400,'Description is missing!');
        }
        if(!newListing.location)
        {
            throw new ExpressError(400,'Location is missing!');
        }*/
        //?saving data in the database
        await newListing.save();
        res.redirect('/listings');
        //console.log(listing);   
       
})
);

//!Edit Route
app.get('/listings/:id/edit',wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
})
);

//!update route
app.put('/listings/:id',validateListing,wrapAsync(async(req,res)=>
{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect('/listings');
})
);

//! Delete Route
app.delete('/listings/:id',wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect('/listings');
})
);

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