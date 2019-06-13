module.exports = exports = function (db) {
  var express = require('express');
  var router = express.Router();
  /* GET posts listing. */
  router.get('/', function (req, res, next) {
    console.log('default route basic');
    res.send('respond with a resource');
  });

  return router;
};
