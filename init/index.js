const mongoose=require('mongoose');
const initData=require('./data');
const Listing=require('../models/listing');

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

const initDB = async()=>
{
    await Listing.deleteMany({}); //?to delete already existing data in the database
    initData.data=initData.data.map((obj)=>({...obj,owner:'67ab3cf430ed1f13dd617548'}));
    await Listing.insertMany(initData.data);
    console.log('data was initialiazed');
};
initDB();