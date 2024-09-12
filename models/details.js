var mongoose  =  require('mongoose');  
   
var excelSchema = new mongoose.Schema({  
    phno:{  
        type:Number  
    },  
    vid:{  
        type:String  
    },    
    
});  
   
module.exports = mongoose.model('details',excelSchema);  