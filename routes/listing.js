const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const{listingSchema}=require('../schema');
const Listing=require('../models/listing');
const methodOverride= require('method-override');




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
router.get('/',wrapAsync(async(req,res)=>
    {
          const allListings= await Listing.find({});
          res.render('listings/index.ejs',{allListings});      
    })
    );
    
//!Create new listing
router.get('/new' ,(req,res)=>
    {
        res.render('listings/new.ejs');
    });
        
    
//!Show Route
router.get('/:id',wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate('review');
    if(!listing)
    {
        req.flash('error','Cannot find the listing!!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs',{listing});
})
);
    
//!Create route after creating new listing
router.post('/',validateListing, wrapAsync(async(req,res,next)=>
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
     req.flash('success','Successfully created a new listing!!');
     res.redirect('/listings');
     //console.log(listing);   
           
})
);
    
//!Edit Route
router.get('/:id/edit',wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing)
        {
            req.flash('error','Cannot find the listing!!');
            return res.redirect('/listings');
        }
    res.render('listings/edit.ejs',{listing});
})
);
    +
//!update route
router.put('/:id',validateListing,wrapAsync(async(req,res)=>
    {
        let{id}=req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash('success','Successfully updated the listing!!');
        res.redirect('/listings');
    })
);
    
//! Delete Route
router.delete('/:id',wrapAsync(async(req,res)=>
    {
        let {id}=req.params;
        let deleteListing=await Listing.findByIdAndDelete(id);
        //console.log(deleteListing);
        req.flash('success','Successfully deleted the listing!!');
        res.redirect('/listings');
    })
);

module.exports=router;