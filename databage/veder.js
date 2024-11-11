const mongoose = require('mongoose');

const venderSchema =new mongoose.Schema({
    name:{
        type:String,
        require:true

    },

    email:{
        type:String,
        require:true,
        unique:true
    }
    ,
    phoneno:{
        type:Number,
        require:true
    }
    ,
    address:{
        type:String,
        require:true
    },

    password:{
        type:String,
        require:true
    }

})
const Vender = mongoose.model("Vender",venderSchema);
module.exports=Vender;