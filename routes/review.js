const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const Listing=require('../models/listing');
const Review=require('../models/review');
//const {reviewSchema}=require('../schema');
const{validateReview,isLoggedIn,isReviewAuthor}=require('../middleware');
const reviewController=require('../controllers/review');

//!Submitting the reviews
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
    
//!Delete the reviews
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;