const  mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/jigs").then(()=>{
    console.log("Databage connect successfully");
    
}).catch((err)=>{
    console.log(err);
    
});