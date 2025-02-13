const Listing = require('../models/listing');

//*index
module.exports.index=async(req,res)=>
    {
          const allListings= await Listing.find({});
          res.render('listings/index.ejs',{allListings});      
    }

//*new
module.exports.new=(req,res)=>
    {
        res.render('listings/new.ejs');
    }    

//*show
module.exports.showListing=async(req,res)=>
{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:'review',populate:{path:'author'},}).populate('owner');
    if(!listing)
    {
        req.flash('error','Cannot find the listing!!');
        return res.redirect('/listings');
    }
    //console.log(listing);
    res.render('listings/show.ejs',{listing});
};

//*posting the new listing
module.exports.createListing=async(req,res,next)=>
    {
      
         const newListing= new Listing(req.body.listing);
         newListing.owner=req.user._id;
         //?handling errors if anyone paramter is missing

         //?saving data in the database
         await newListing.save();
         req.flash('success','Successfully created a new listing!!');
         res.redirect('/listings');
     } //console.log(listing);   
 
//*editlisting
module.exports.editListing=async(req,res)=>
    {
        let {id}=req.params;
        const listing=await Listing.findById(id);
        if(!listing)
            {
                req.flash('error','Cannot find the listing!!');
                return res.redirect('/listings');
            }
        res.render('listings/edit.ejs',{listing});
    }

//*update listing
module.exports.updateListing=async(req,res)=>
    {
        let{id}=req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash('success','Successfully updated the listing!!');
        res.redirect('/listings');
    }  
         
//*delete listing
module.exports.deleteListing=async(req,res)=>
    {
        let {id}=req.params;
        let deleteListing=await Listing.findByIdAndDelete(id);
        //console.log(deleteListing);
        req.flash('success','Successfully deleted the listing!!');
        res.redirect('/listings');
    }     