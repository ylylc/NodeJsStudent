var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes');
var users = require('./routes/users');
var session  = require('express-session');
var MongoStore = require('connect-mongo')(session);
var setting = require('./setting');
var flash = require('connect-flash');
var partials = require('express-partials');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
   secret:setting.cookieSecret,
   key:setting.db,
   cookie:{maxAge:1000*60*60*24*30},
   store:new MongoStore({
      db:setting.db
   }) 
}));
app.use(partials());
app.use(flash());

app.use(function(req,res,next){
  res.locals.user = req.session? req.session.user : null;
  res.locals.error = req.flash('error').length ? req.flash('error') : null;
  res.locals.success = req.flash('success').length ? req.flash('success') : null;
  next();
})
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
