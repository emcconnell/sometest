var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);



var nconf = require('nconf');

nconf.env().defaults({
    'AZURE_STORAGE_ACCOUNT': 'learnaccount',
    'AZURE_STORAGE_ACCESS_KEY': 'oI5ONRqPNRe7fFHiF0bDrWkd7+dR0IfcC3pxEfIUwXGOB23//6d8SjP8TOOhSMHCXrqKjYm7eg3mf+mnF9/B7A=='
});


var azure = require('azure');

var storageAccount = nconf.get('AZURE_STORAGE_ACCOUNT');
var storageKey = nconf.get('AZURE_STORAGE_ACCESS_KEY');
var tableService = azure.createTableService(storageAccount, storageKey);
tableService.createTableIfNotExists('people', function(error){
    if(!error)
    {
        // Table exists or created
    }
});

app.get('/api/person/:id', function(req, res) {
    tableService.queryEntity('people'
        , 'all'
        , req.params.id
        , function(error, entity){
            if(error){
                throw error;
            }
            res.json({
                "id": entity.RowKey
               , "name": entity.Name
            });
        });

});

app.post('/api/person/', function(req, res) {
    console.log(req.body);
});

app.get('/api/test', function(req, res) {
    res.json({"id": 2, "name": "someone"});
});

app.post('/api/test', function(req, res) {
    console.log(req.body);
});







/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
