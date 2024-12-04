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
    deadendDate:{
        type:Date,
        required:true
    },
    additionalNotes:{
       type:String,
      
    }

})
const Industry=mongoose.model('Industry',schema);
module.exports=Industry;