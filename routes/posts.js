module.exports = exports = function (db) {
  var express = require('express');
  var router = express.Router();
  /* GET posts listing. */
  router.get('/', function (req, res, next) {
    console.log('Making posts request');
    const collection = db.collection('users');
    // Define initial set of query parameters
    let limit = parseInt(req.query.limit),
      page = parseInt(req.query.page),
      order = { CreationDate: 1 },
      findObject = null;
    // Set error handling for negative page values (and zero page values)
    if (page <= 0) {
      page = 1;
    }
    // Reset order parameter if a value is found
    if (req.query.order) {
      order = req.query.order;
      const orderKeys = Object.keys(order);
      for (let i = 0; i < orderKeys.length; i++) {
        order[orderKeys[i]] = parseInt(order[orderKeys[i]]);
      }
    }
    // Reset search parameter if a value is found
    if (req.query.search) {
      findObject = { $text: { $search: "\"" + req.query.search + "\"" } };
    }
    // Get a count of the documents to determine last page index
    let pagedata = { current: page };
    collection.find(findObject).count((err, count) => {
      if (err) throw err;
      pagedata.last = Math.ceil(count / limit);
      // If no documents are found, the last page is '0' thus we return 'No results found'
      if (pagedata.last == 0) {
        res.status(404).send({ message: 'No results found.' });
      } else {
        // Handling for page 1
        if (page === 1) {
          collection.find(findObject).sort(order).limit(limit).toArray(function (err, result) {
            if (err) throw err;
            pagedata.prev = null;
            if (pagedata.last === page) {
              pagedata.next = null;
            } else {
              pagedata.next = pagedata.current + 1;
            }
            res.send({ pagedata: pagedata, result: result, limit: limit });
          })
        // Handling for page 2 through n
        } else {
          const skip = ((page - 1) <= 0) ? 1 : page - 1;
          collection.find(findObject).sort(order).skip(limit * (skip)).limit(limit).toArray(function (err, result) {
            if (err) throw err;
            if (pagedata.last === page) {
              pagedata.prev = pagedata.current - 1;
              pagedata.next = null;
            } else {
              pagedata.prev = pagedata.current - 1;
              pagedata.next = pagedata.current + 1;
            }
            res.send({ pagedata: pagedata, result: result, limit: limit });
          })
        }
      }
    });
  });

  return router;
};
