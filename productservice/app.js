var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var monk = require('monk'); // load MongoDB\
var cors = require('cors'); // enable CORS
var cookieParser = require('cookie-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var products_router = require('./routes/products'); // load router module

var app = express();

var db = monk('localhost:27017/assignment2'); // load database
var corsOptions = { // specify CORS options
    "origin": "http://localhost:3000",
    "credentials": true
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.options('*', cors()); // handling pre-flight requests
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', products_router); // load router module

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// make database accessible to router
app.use(function (req, res, next) {
    req.db = db;
    next();
})

// serving static file /public
app.use(express.static('./public'));

// enable CORS
app.use(cors());

// use coolieParser middleware
app.use(cookieParser());

//module.exports = app;
var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server listening at http://%s:%s", host, port);
})
