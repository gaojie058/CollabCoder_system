const express = require("express");

const dbo = require("../db/Connection");
const { query } = require("../db/Utils");

const projectRouter = express.Router();
const collection = "projects"

const isValidCode = (code) => {
  return code != null && code != "" && code != undefined
}
const calculateOneProgress = (segmented_data, userName) => {
  const containUserCodeLength = segmented_data.map(data => data.codes).flat(2).filter(obj => obj.author == userName && isValidCode(obj.code)).length
  return Math.round(containUserCodeLength / segmented_data.length * 1000) / 10
}

const calculateAllProgress = (segmented_data, coders) => {
  const progressList = {}
  coders.forEach(coder => {
    progressList[coder.name] = calculateOneProgress(segmented_data, coder.name)
  });
  return progressList
}

projectRouter.route("/:owner/:project").get(function (req, res) {
  let myDb = dbo.getDb();
  let filter = { name: req.params.project, owner: req.params.owner }
  query(myDb, collection, filter).then(value => {
    let project = value[0]
    let allProgress = calculateAllProgress(project.segmented_data, project.coders)
    res.json([project, allProgress])
    res.end()
  })
    .catch(err => {
      res.json({})
      res.end()
      console.log(err)
    })
});

projectRouter.route("/:owner/:project").delete(async function (req, res) {
  let filter = { name: req.params.project, owner: req.params.owner }
  const coll = dbo.getDb().collection(collection);
  coll.deleteOne(filter)
    .then(result => {
      res.send(result)
      console.log(`Deleted ${result.deletedCount} item.`)
    })
    .catch(err => {
      res.send(err)
      console.error(`Delete failed with error: ${err}`)
    })
});

module.exports = projectRouter;