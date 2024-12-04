const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contactNumber:{
       type:String,
       required:true
    },
    wasteType:{
        type:String,
        required:true
    },
    wasteWeight:{
        type:Number,
         required:true
    },
    pickupDate:{
        type:Date,
        required:true
    },
    pickupTime:{
        type:String,
        required:true
    },
    pickupAddress:{
        type:String,
        required:true
    },
    additionalNotes:{
       type:String,
      
    }

})
const PickupData=mongoose.model('PickupData',schema);
module.exports=PickupData;