const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');

const app=express();

const dotenv = require('dotenv');
dotenv.config({
    path:'./config/.env',
});


mongoose.connect("mongodb://localhost/Expo",{
    useNewUrlParser: true,
    useUnifiedTopology: true,

});

const db = mongoose.connection;

db.once("open",function(){
    console.log("Connected to MongoDB".cyan.bold);
});

//check for db errors
db.on("error", function (err) {
    console.log(err);
});



app.use(express.urlencoded({ extended: true }));

app.use(express.json({}));
app.use(
    express.json({
        extended: true,
    })
);

app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));

app.use("/", require("./routes/index"));


const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server running on :${PORT}`.green.underline.bold);
});