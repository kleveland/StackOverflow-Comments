module.exports = new Promise(function (resolve, reject) {
  var createError = require('http-errors');
  var express = require('express');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');

  const mongo = require('mongodb').MongoClient;
  const url = 'mongodb://localhost:27017';

  var app = express();

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // catch 404 and forward to error handler
  // app.use(function (req, res, next) {
  //   next(createError(404));
  // });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  mongo.connect(url, { useNewUrlParser: true }, function (err, client) {
    if (err) throw err;
    console.log("Database connected");
    const db = client.db('stackoverflow');
    app.use('/', require('./routes/index')(db));
    app.use('/posts', require('./routes/posts')(db));
    resolve(app);
  });

});
