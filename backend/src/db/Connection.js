const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
var _db;
 
module.exports = {
    connectToDb: function (callback) {
      client.connect(function (err, db){
        // Verify we got a good "db" object
        if (db)
        {
          _db = db.db("diff_coder");
          console.log("Successfully connected to MongoDB."); 
        }
        return callback(err);
           });
    },
    connectToTestDb: function (callback) {
      client.connect(function (err, db) {
        if (db)
        {
          _db = db.db("ServerTesting");
          console.log("Successfully connected to MongoDB."); 
        }
        return callback(err);
           });
    },
   
    getDb: function () {
      return _db;
    },
    closeDb: function(e){
      client.close()
    }
  };
