const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var DButilsAzure = require('./DButils');
app.use(express.json());

function sortByCategory(req, res) {
    DButilsAzure.execQuery("SELECT POI.* FROM POI " +
        "WHERE POI.CategoryID ='" + req.body.categoryID + "' " +
        "ORDER BY POI.Rank DESC")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}

function orederByRank(req, res) {
    DButilsAzure.execQuery("SELECT POI.* " +
        "FROM POI " +
        "ORDER BY POI.Rank DESC")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}

function searchByName(req, res) {
    DButilsAzure.execQuery("SELECT POI.* " +
        "FROM POI " +
        "WHERE POI.NamePOI = '" + req.body.name_POI + "'")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}

function addRank(req, res) {
    if (req.body.myRank && req.body.namePoi) {
        if (req.body.myRank <= 10) {
            DButilsAzure.execQuery("UPDATE POI " +
                "SET Rank = '" + req.body.myRank + "' " +
                "WHERE NamePOI='" + req.body.namePoi + "'")
                .then(function (result) {
                    res.send(result)
                })
                .catch(function (err) {
                    console.log(err)
                    res.send(err)
                })
        } else {
            res.status(401).send("rank(myRank) need to be less than 10!");
        }
    } else {
        res.status(401).send("Expected new rank(myRank) and namePoi(namePoi)!");
    }
}

function addReview(req, res) {
    if (req.body.myReview && req.body.namePoi) {
        DButilsAzure.execQuery("UPDATE Comments " +
            "SET Details = '" + req.body.myReview + "' " +
            "WHERE NamePOI='" + req.body.namePoi + "'")
            .then(function (result) {
                res.send(result)
            })
            .catch(function (err) {
                console.log(err)
                res.send(err)
            })
    } else {
        res.status(401).send("Expected new review(myReview) and namePoi(namePoi)!");
    }
}

function getRandomPOI(req, res) {
    DButilsAzure.execQuery("SELECT TOP 3 * " +
        "FROM POI " +
        "WHERE Rank >= 3.5 " +
        "ORDER BY NEWID()")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })

}

function RestorePassword(req, res) {
    if (req.body.username && req.body.question && req.body.answer) {
        DButilsAzure.execQuery("SELECT PassQuestion " +
            "FROM Users " +
            "WHERE Username='" + req.body.username + "'")
            .then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    //console.log(result[0].PassQuestion)
                    var QA = JSON.parse(result[0].PassQuestion);
                    console.log(QA[0].q)
                    if (QA[i].q == req.body.question && QA[i].ans == req.body.answer) {
                        DButilsAzure.execQuery("SELECT password " +
                            "FROM Users " +
                            "WHERE Username='" + req.body.username + "'")
                            .then(function (result2) {
                                res.send(result2)
                                console.log(result2);
                            })
                            .catch(function (err) {
                                console.log(err)
                                res.send(err)
                            })
                    } else {
                        res.status(401).send("The answer doesn't match");
                    }
                }
            })
            .catch(function (err) {
                console.log(err)
                res.send(err)
            })
    }else{
        res.status(401).send("Expected all the right parameters! userName,Question and answer!");
    }
}
    module.exports.sortByCategory = sortByCategory;
    module.exports.orederByRank = orederByRank;
    module.exports.searchByName = searchByName;
    module.exports.addRank = addRank;
    module.exports.addReview = addReview;
    module.exports.getRandomPOI = getRandomPOI;
    module.exports.RestorePassword = RestorePassword;


