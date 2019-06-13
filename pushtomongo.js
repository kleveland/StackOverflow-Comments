const node_xml_stream = require('node-xml-stream');
const parser = new node_xml_stream();
const fs = require('fs');
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let clientObj = null,
collection = null,
insertObj = {};
// temporary variables to construct final object

// callback contains the name of the node and any attributes associated
parser.on('opentag', function(name, attrs) {
    console.log(name, attrs);
    insertObj = attrs;
    insertObj.CreationDate = new Date(insertObj.CreationDate);
    insertObj.Score = parseInt(insertObj.Score);
    collection.insertOne(insertObj, (err, result) => {
        if(err) {
            console.log("@@", err);
        }
        console.log("Inserted successfully.");
    })
});

// callback to do something after stream has finished
parser.on('finish', function() {
    clientObj.close();
    console.log('Done.');
});

mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    console.log("Database created!");
    // print database name
    clientObj = client;
    const db = client.db('stackoverflow');
    console.log("db object points to the database : "+ db.databaseName);
    collection = db.collection('users');
    collection.createIndex({ Text: "text" });
    let stream = fs.createReadStream('../Comments.xml', 'UTF-8');
    stream.pipe(parser);
});