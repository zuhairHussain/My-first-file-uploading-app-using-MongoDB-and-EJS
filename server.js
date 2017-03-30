var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var urlencoderParser = bodyParser.urlencoded({extended: false});

/*------- Using Multer for uploading images to upload directory & multiparty for fetching both data(text/images) from one form --------*/
var multiparty = require('multiparty');
var multer  =   require('multer');
var upload = multer({ dest: 'uploads/' })




/*-----MONGO DB-----*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:bunty125@ds141410.mlab.com:41410/first')
var schema = new mongoose.Schema({name: String,imgUrl : String, price : Number, desc : String})
var data = mongoose.model('data',schema);



// render all files from static folder
app.use('/static', express.static('static'))
app.use('/uploads', express.static('uploads'))
// set the view engine to ejs
app.set('view engine', 'ejs');




//--------- index page ------------//
app.get('/', function(req, res) {
    data.find({}, function(err,data){
        if(err) throw err;
        res.render('pages/index', {data: data});
    })
});

/*------- Product page --------*/
app.get('/id/:id', function (req, res) {
    data.findOne( {_id:req.params.id} , function(err, item) {
        if(err) throw err;
        res.render('pages/idtemp', {item: item});
    });
})


//------------- Ad Post page ------------//
app.get('/ad-post', function(req, res) {
    res.render('pages/post');
});


//------------- get data of post request and save to mongoDB ------------//
app.post('/ad-post', urlencoderParser ,function(req, res) {
    
    var date = Date.now();

     var form = new multiparty.Form();
     form.parse(req, function(err, fields, files) {
        var imgur = date + '.' +  files.userPhoto2[0].originalFilename;


        data({name: req.body.name, imgUrl : imgur, price : req.body.price, desc : req.body.desc}).save(function(err){
            if(err) throw err;

        })
     })


    var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads');
    },
    filename: function (req, file, callback) {
        callback(null, date +'.'+ file.originalname);
        filename = date +'.'+ file.originalname;
    }
    });
    var upload = multer({ storage : storage}).single('userPhoto2');
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        
    });
    
    res.render('pages/thanks');
});


app.listen(8080);
console.log('8080 is the magic port');