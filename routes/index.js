const express = require('express');
const router = express.Router();

var app = express();

const Events = require('../models/eventlist');
const Seminars = require('../models/seminar');
const Visitor = require('../models/visitor');
const Locations = require('../models/location');

// =------ uploading excel(NEWLY added on 18-3-22)--=======
var multer      = require('multer');  
var Details    = require('../models/details');  
var excelToJson = require('convert-excel-to-json');
var bodyParser  = require('body-parser'); 
const { route } = require('express/lib/application');
const path = require('path');
const { Route } = require('express');

var storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
    cb(null,'uploads/');  
    },  
    filename:(req,file,cb)=>{  
    cb(null,file.originalname);  
    }  
    }); 
    
    
var uploads = multer({storage:storage});  


router.get('/upload',(req,res)=>{
    res.render('upload');
});



router.post("/uploadfile", uploads.single("uploadfile"),(req, res) => {
    console.log(req.file.filename);


    try {
        var filePath =path.join(__dirname, "../uploads/") + req.file.filename;
        const excelData = excelToJson({
            sourceFile: filePath,
            sheet1: [
              {
                name: "Data",
                header: {
                  rows: 1,
                },
                
              },
            ],
          });
          console.log(excelData.Sheet1);

          excelData.Sheet1.forEach(async (sheet) => {
            console.log(sheet);
            let now = new Date();
      
            let user = new Details();
            user.phno = Number(sheet.A ? sheet.A : "");
            user.vid = (sheet.B ? sheet.B : "");
            
            
            var UserINs = await user.save();
            console.log(UserINs);
          });

    
    } catch (error) {
        console.log(error);
    }
});


// =------ uploading excel(NEWLY added on 18-3-22)--=======

router.get('/',async(req,res)=>{

    let visitors = await Visitor.findOne({name: 'localhost'});


    if(visitors == null) {
          
        // Creating a new default record
        const beginCount = new Visitor({
            name : 'localhost',
            count : 1
        });
  
        // Saving in the database
        beginCount.save();
    }
    else{
          
        // Incrementing the count of visitor by 1
        visitors.count += 1;
  
        // Saving to the database
        visitors.save()
  
    }

    const count=visitors.count;




    const date = new Date();

    let hour = date.getHours();
    let min = date.getMinutes();
    
    if(hour>12){
        hour=hour-12;
    }
    // let cday = date.getDate()

    // let hour =11;
    // let min = 15;
    let cday = 26;



    
    var timelist,slist;
    if(hour===11 || hour===3){
        timelist = await Events.find({
            starthr: hour,
            endmin : 30,
            day : cday
        });

        slist = await Seminars.find({
            starthr: hour,
            endmin : 30,
            day : cday
        });
    }
    else{
        timelist = await Events.find({
            starthr: hour,
            day: cday
        });

        slist = await Seminars.find({
            starthr: hour,
            day:cday
        });

    }
    
    res.render('home',({timelist:timelist,day:cday,slist:slist,count}));
});


router.get('/cse',(req,res)=>{
    res.render('cse');
});

router.get('/ece',(req,res)=>{
    res.render('ece');
});

router.get('/eee',(req,res)=>{
    res.render('eee');
});
router.get('/mech',(req,res)=>{
    res.render('mech');
});
router.get('/civil',(req,res)=>{
    res.render('civil');
});









router.get('/events',async(req,res)=>{
    var timelist1,slist1,timelist2,slist2;
    var date = new Date();
    let cdate = date.getDate

    timelist1 = await Events.find({day:26});
    slist1 = await Seminars.find({day:26});

    timelist2 = await Events.find({day:27});
    slist2 = await Seminars.find({day:27});


    // console.log(slist1);
    // console.log('------');
    // console.log(slist2);







    res.render('events',{timelist1:timelist1,slist1:slist1,timelist2:timelist2,slist2:slist2});
});

router.get('/register',(req,res)=>{
    res.render('register');
});


router.get('/volunteer',(req,res)=>{
    res.render('volunteer');
});


router.get('/searchby',(req,res)=>{
    res.render('search');
});

router.post('/searchby',async(req,res)=>{
    const {phno}=req.body;
    const user = await Details.findOne({ phno: phno });

    console.log(user);
    
    if (user) {
    
        
        res.render("result",{vid:user.vid,phno:user.phno})
    }
    
                        
  
    else{
        res.redirect("/searchby");
    }

});


router.post('/register',(req,res)=>{
    console.log('register');
    const {
        ename,
        starttime,
        endtime,
        content,
        location,
        day
    }=req.body;

    let event = new Events();
    event.ename = ename;
    event.starttime = starttime;
    event.endtime = endtime;
    event.content = content;
    event.location = location;
    event.day = day;

    event.save();

    console.log("saved!");

});




router.get('/update',async(req,res)=>{
    const location = await Locations.find();
    res.render('update',{location});

});

router.post("/changeEntry/:lid", async (req, res) => {
    try {
        // let overallData = await Overall.findOne({}).select({ controls: 1 });
        var lid = req.params.lid;
        const status = req.body.crowd;
        // console.log(status);

        const loc = await Locations.findOne({ lid: req.params.lid });
        loc.crowd=status;
        loc.save();

        res.redirect('/update');
    }catch(error){
        console.log(error);

    }
});

router.get("/status",async(req,res)=>{
    const location = await Locations.find();
    res.render('status',{location});
    
});


router.get("/tv",async(req,res)=>{
    const col1 = await Locations.find({ lid : { $gt :  0, $lt : 12}});
    const col2 = await Locations.find({ lid : { $gt :  11, $lt : 23}});
    const col3 = await Locations.find({ lid : { $gt :  22, $lt : 32}});

    res.render('tv',{col1,col2,col3});
});



module.exports=router;