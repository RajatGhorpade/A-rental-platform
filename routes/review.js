const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const Listing=require('../models/listing');
const Review=require('../models/review');
const {reviewSchema}=require('../schema');

//!validations of serverside for Reviews
const validateReview=(req,res,next)=>
    {
        let {error}=reviewSchema.validate(req.body);
       
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
    

//!Submitting the reviews
router.post('/',validateReview,wrapAsync(async(req,res)=>
    {
         let listing=await Listing.findById(req.params.id);
         let newReview=new Review(req.body.review);
    
         listing.review.push(newReview);
    
         await newReview.save();
         await listing.save();
    
         console.log('new review saved');
         req.flash('success','Review added successfully');
         res.redirect(`/listings/${listing._id}`);
    })
    );
    
//!Delete the reviews
router.delete('/:reviewId',wrapAsync(async(req,res)=>
    {
        let{id,reviewId}=req.params;
        
        await Review.findByIdAndDelete(reviewId);
        await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
        req.flash('success','Review deleted successfully');
        res.redirect(`/listings/${id}`);
    })
);
module.exports=router;