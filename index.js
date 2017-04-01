var express = require('express');
var app = express();
var router = express.Router();

/*---------CONTROLLER-----------*/
var controller = require('./controller/controller')
controller(app);

// render all files from static folder
app.use('/static', express.static('static'))
app.use('/uploads', express.static('uploads'))
// set the view engine to ejs
app.set('view engine', 'ejs');




app.listen(8080);
console.log('8080 is the magic port');