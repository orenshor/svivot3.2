const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var DButilsAzure = require('./DButils');
app.use(express.json());

function sortByCategory(req,res){
    DButilsAzure.execQuery("SELECT POI.* FROM POI WHERE POI.CategoryID ='" + req.body.categoryID + "' ORDER BY POI.Rank DESC")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}
function orederByRank(req,res){
    DButilsAzure.execQuery("SELECT POI.* FROM POI order by POI.Rank DESC")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}
function searchByName(req,res){
    DButilsAzure.execQuery("SELECT POI.* FROM POI WHERE POI.NamePOI = '"+ req.body.name_POI +"'")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}

module.exports.sortByCategory = sortByCategory;
module.exports.orederByRank = orederByRank;
module.exports.searchByName = searchByName;
