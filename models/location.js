var mongoose  =  require('mongoose');  
   
var locationSchema = new mongoose.Schema({  
    loc:{  
        type:String  
    },  
    crowd: { type: String, default: false },
    lid:{
        type:Number
    }    
    
});  
   
module.exports = mongoose.model('locations',locationSchema);  