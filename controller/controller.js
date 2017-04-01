var bodyParser = require('body-parser');
var urlencoderParser = bodyParser.urlencoded({extended: false});


/*------- Using Multer for uploading images to upload directory & multiparty for fetching both data(text/images) from one form --------*/
var multiparty = require('multiparty');
var multer  =   require('multer');


/*-----MONGO DB-----*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:bunty125@ds141410.mlab.com:41410/first')
var schema = new mongoose.Schema({name: String,imgUrl : String, price : Number, desc : String,cat: String})
var data = mongoose.model('data',schema);





module.exports = function(app){

    //--------- HOME page ------------//
    app.get('/', function(req, res) {
            res.render('pages/index');
    });

    //--------- categories page ------------//
    app.get('/categories/:id', function(req, res) {
        data.find({cat:req.params.id}, function(err,data){
            if(err) throw err;
            res.render('pages/categories', {data: data, pgname: req.params.id});
        });
    });

    /*------- Product page --------*/
    app.get('/id/:id', function (req, res) {
        data.findOne( {_id:req.params.id} , function(err, item) {
            if(err) throw err;
            res.render('pages/idtemp', {item: item});
        });
    });


    //------------- Ad Post page ------------//
    app.get('/ad-post', function(req, res) {
        res.render('pages/post');
    });


    //------------- get data of post request and save to mongoDB ------------//
    app.post('/ad-post', urlencoderParser ,function(req, res) {
        
        var date = Date.now();

        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            var imgur = date + '.' +  files.userPhoto[0].originalFilename;


            data({name: req.body.name, imgUrl : imgur, price : req.body.price, desc : req.body.desc, cat: req.body.cat}).save(function(err){
                if(err) throw err;

            });
        });


        var storage =   multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'uploads');
        },
        filename: function (req, file, callback) {
            callback(null, date +'.'+ file.originalname);
            filename = date +'.'+ file.originalname;
        }
        });
        var upload = multer({ storage : storage}).single('userPhoto');
        upload(req,res,function(err) {
            if(err) {
                return res.end("Error uploading file.");
            }
            
        });
        
        res.render('pages/thanks');
    });

}