import mongoose from "mongoose";

const phonesSchema=new mongoose.Schema({
    name:{
        type:String,
        Required:true
    },
    type:{
        type:String,
        Required:true
    },
    processor:{
        type:String,
        Required:true
    },
    memory:{
        type:String,
        Required:true
    },
    os:{
        type:String,
        Required:true
    },
    price:{
        type:String,
        Required:true
    },
    priceRange:{
        type:String,
        Required:true
    },
    images:{
        type:Array,
        Required:true
    }

})

 const PHONES=new mongoose.model('PHONES',phonesSchema);

export default PHONES