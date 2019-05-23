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
function addRank(req,res){
    if(req.body.myRank && req.body.namePoi) {
        if(req.body.myRank <= 10) {
            DButilsAzure.execQuery("UPDATE POI SET Rank = '" + req.body.myRank + "' WHERE NamePOI='" + req.body.namePoi + "'")
                .then(function (result) {
                    res.send(result)
                })
                .catch(function (err) {
                    console.log(err)
                    res.send(err)
                })
        }
        else{
            res.status(401).send("rank(myRank) need to be less than 10!");
        }

    }
    else {
        res.status(401).send("Expected new rank(myRank) and namePoi(namePoi)!");
    }
}
function addReview(req,res){
    if(req.body.myReview && req.body.namePoi) {
            DButilsAzure.execQuery("UPDATE Comments SET Details = '" + req.body.myReview + "' WHERE NamePOI='" + req.body.namePoi + "'")
                .then(function (result) {
                    res.send(result)
                })
                .catch(function (err) {
                    console.log(err)
                    res.send(err)
                })

    }
    else {
        res.status(401).send("Expected new review(myReview) and namePoi(namePoi)!");
    }
}
function getRandomPOI(req,res){
    DButilsAzure.execQuery("SELECT TOP 1 * FROM POI ORDER BY NEWID()")
        .then(function (result) {
            res.send(result)

        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })

}
function RestorePassword(req,res){
    var found = false;
    for (var i=0; i<req.body[i].length && !found;i++){
        if(req.body[i].userName && req.body[i].question && req.body[i].answer ) {
            if(req.body[i].question.length != 0 || req.body[i].answer.length != 0){
                DButilsAzure.execQuery("SELECT Password FROM Users WHERE Username='" + req.body[i].userName + "' AND PassQuestion='" + req.body[i].question+"'")
                    .then(function (result) {
                        found = true;
                        res.send(result)
                        console.log(result);
                    })
                    .catch(function (err) {
                        console.log(err)
                        res.send(err)
                    })
            }
            else{
                res.status(401).send("insert valid questions and answers!");
            }
        }
        else{
            res.status(401).send("Expected all the right parameters! userName,Question and answer!");
        }
    }

}

module.exports.sortByCategory = sortByCategory;
module.exports.orederByRank = orederByRank;
module.exports.searchByName = searchByName;
module.exports.addRank = addRank;
module.exports.addReview = addReview;
module.exports.getRandomPOI = getRandomPOI;
module.exports.RestorePassword = RestorePassword;


