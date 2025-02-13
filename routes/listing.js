const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync');
//const ExpressError=require('../utils/ExpressError');
//const{listingSchema}=require('../schema');
const Listing=require('../models/listing');
//const methodOverride= require('method-override');
const {isLoggedIn, isOwner,validateListing}=require('../middleware');
const listingController=require('../controllers/listings');
const multer=require('multer');
const {storage}=require('../cloudConfig');
const upload=multer({storage});


//!Index route
router.get('/',wrapAsync(listingController.index));
    
//!Create new listing
router.get('/new',isLoggedIn ,listingController.new);
        
    
//!Show Route
router.get('/:id',wrapAsync(listingController.showListing));
    
//!Create route after creating new listing
router.post('/',isLoggedIn,validateListing ,wrapAsync(listingController.createListing));

//!Edit Route
router.get('/:id/edit',isLoggedIn,isOwner ,wrapAsync(listingController.editListing));
    +
//!update route
router.put('/:id',validateListing,isLoggedIn,isOwner ,wrapAsync(listingController.updateListing));
    
//! Delete Route
router.delete('/:id',isLoggedIn,isOwner ,wrapAsync(listingController.deleteListing));

module.exports=router;