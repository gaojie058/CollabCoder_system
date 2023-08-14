module.exports.insert = insert;
module.exports.query = query;
module.exports.update = update;
module.exports.del = del;

async function insert(db, collection, docs) {
  // docs is an Array()

  // database and collection code goes here
  const coll = db.collection(collection);

  // insert data
  const result = await coll.insertMany(docs);
}

async function query(db, collection, filter) {

  // database and collection code goes here

  const coll = db.collection(collection);

  // find data
  const cursor = coll.find(filter); // find with queries
  const res = Array();
  await cursor.forEach(e => {
    res.push(e);
  })
  console.log("Number of documents queried: 1");
  return res;
}


async function update(db, collection, docs, filter) {
  // database and collection code goes here

  const coll = db.collection(collection);

    const result = await coll.updateMany(
      filter,
      { $set: docs },
      {
        upsert: true,
        multi: true
      });
    console.log("Number of documents updated: " + result.modifiedCount);

}

async function del(db, collection, doc) {

  // database and collection code goes here

  const coll = db.collection(collection);

  // delete 
  const result = await coll.deleteMany(doc);
  // amount deleted code goes here
  console.log("Number of documents deleted: " + result.deletedCount);

}
