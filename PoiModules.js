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

function orderByRank(req, res) {
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
        "WHERE POI.NamePOI = '" + req.body.NamePOI + "'")
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
            DButilsAzure.execQuery("SELECT rank, numOfRankers FROM POI WHERE NamePOI = '"+ req.body.namePoi +"'")
                .then(function (result) {
                    var newRank = ((result[0].rank * result[0].numOfRankers) + parseInt(req.body.myRank))/ (result[0].numOfRankers + 1)
                    DButilsAzure.execQuery("UPDATE POI " +
                        "SET rank =" + newRank +
                        "WHERE NamePOI = '"+ req.body.namePoi +"'"+
                        "UPDATE POI " +
                        "SET numOfRankers = numOfRankers + 1 " +
                        "WHERE NamePOI = '" + req.body.namePoi +"'")
                        .then(function () {
                            res.send("Rank updated")
                        })
                        .catch(function (err) {
                            console.log(err)
                            res.send(err)
                        })
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

function addOneView(req, res) {
    if (req.body.namePoi) {
            DButilsAzure.execQuery("UPDATE POI " +
                "SET numOfViews = numOfViews + 1 " +
                "WHERE NamePOI = '"+ req.body.namePoi +"'")
                .then(function () {
                    res.send("numOfViews updated.")
                })
                .catch(function (err) {
                    console.log(err)
                    res.send(err)
                })
    } else {
        res.status(401).send("Expected namePoi(namePoi)!");
    }
}

function addReview(req, res) {
    var username = req.decoded.username;
    if (req.body.myReview && req.body.namePoi) {
        DButilsAzure.execQuery("SELECT MAX(CommentID) AS maxID FROM Comments;")
            .then(function (maxID) {
                var id = parseInt(maxID[0].maxID) + 1
                console.log(maxID[0].maxID)
                var rightNow = new Date().toLocaleString().replace(', ', ' ').replace(/PM AM\..*$/, '');
                console.log(rightNow)
                DButilsAzure.execQuery("INSERT INTO Comments VALUES ('" + id +"', '" + req.body.myReview +"', '"+ username +
                    "', '" + req.body.namePoi + "', '" + rightNow +"');")
                    .then(function () {
                        res.send("Review added.")
                    })
                    .catch(function (err) {
                        console.log(err)
                        res.send(err)
                    })
            })
            .catch(function (err) {
                console.log(err)
                res.send(err)
            })
    } else {
        res.status(401).send("Expected new review(myReview) and namePoi(namePoi)!");
    }
}

function getLastReviews(req,res) {
    DButilsAzure.execQuery("SELECT Top 2 Comments.* " +
        "FROM Comments " +
        "WHERE Comments.namePOI = '" + req.body.NamePOI + "'")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.status(401).send("Problem in getLastPOI!");
        })
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


    module.exports.sortByCategory = sortByCategory;
    module.exports.orderByRank = orderByRank;
    module.exports.searchByName = searchByName;
    module.exports.addRank = addRank;
    module.exports.addOneView = addOneView;
    module.exports.getLastReviews = getLastReviews;
    module.exports.addReview = addReview;
    module.exports.getRandomPOI = getRandomPOI;



