var cors = require('cors');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// use lab6-db
var monk = require('monk');
var db = monk('localhost:27017/assignment2');

// product wouter
var products_router = require('./routes/products');

// cros option
var corsOptions = {
    "origin": "http://localhost:3000",
    "credentials": true
}

var app = express();
app.use(cors(corsOptions));
app.use(cookieParser());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Make our db accessible to routers 
app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.options('*', cors(corsOptions));
app.use('/', products_router);

// for requests not matching the above routes, create 404 error and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development environment
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// module.exports = app;
var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Assignment 2 server listening at http://%s:%s", host, port);
})