const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var DButilsAzure = require('./DButils');
app.use(express.json());

function login(req,res){
    if (req.body.username && req.body.password) {
        DButilsAzure.execQuery("SELECT * FROM Users WHERE Users.Username= '" + req.body.username + "' AND " + "Users.Password= '" + req.body.password + "'")
            .then(function (result) {
                if (result.length > 0) {
                    payload = {username: req.body.username};
                    options = {expiresIn: "1d"};
                    const token = jwt.sign(payload, secret, options);
                    res.send({"token": token, "full_name": result[0].First_name + " " + result[0].Last_name});
                } else {
                    res.status(401).send("Access denied. No such username or password.");
                }
            })
            .catch(function (err) {
                console.log(err)
                res.send(err)
            })
    } else {
        res.status(401).send("Expected username and password!");
    }
}
function register(req,res){
    if (req.body.username && req.body.password && req.body.passQuestion && req.body.passAnswer && req.body.city &&
        req.body.country && req.body.email && req.body.firstName && req.body.lastName) {
        DButilsAzure.execQuery("INSERT INTO Users VALUES ('" + req.body.username + "', '" + req.body.password + "', '" + req.body.passQuestion + "', '" + req.body.passAnswer + "', '" + req.body.city + "', '" +
            req.body.country + "', '" + req.body.email + "', '" + req.body.firstName + "', '" + req.body.lastName + "');")
            .then(function (result) {
                res.send()
            })
            .catch(function (err) {
                console.log(err)
                res.send(err)
            })
    } else {
        res.status(401).send("Please insert all required fields!");
    }
}
function mostUpdatePois(req,res){
    var username = req.decoded.username;
    DButilsAzure.execQuery("SELECT  TOP 2 POI.* FROM POI, CategoryOfUsers WHERE CategoryOfUsers.CategoryID = POI.CategoryID AND CategoryOfUsers.username='" + username + "' order by POI.Rank DESC")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}
function lastSvaedPois(req,res){
    var username = req.decoded.username;
    DButilsAzure.execQuery("SELECT top 2 POI.* FROM POI, Favorite WHERE Favorite.NamePOI = POI.NamePOI AND Favorite.username='" + username + "' order by Favorite.indexForUser DESC")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}


module.exports.login = login;
module.exports.register = register;
module.exports.mostUpdatePois = mostUpdatePois;
module.exports.lastSvaedPois = lastSvaedPois


