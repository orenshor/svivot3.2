const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
var DButilsAzure = require('./DButils');
var moment = require('moment');
app.use(express.json());

function login(req, res) {
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


function register(req, res) {
    if (/^[a-zA-Z]+$/.test(req.body.username) && req.body.username.length >= 3 && req.body.username.length <= 8
        && /^[a-zA-Z0-9]+$/.test(req.body.password) && req.body.password.length >= 5 && req.body.password.length <= 10
        && req.body.passQuestion.length >= 2 && req.body.city && req.body.country &&
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(req.body.email)
        && req.body.firstName && req.body.lastName && req.body.categories.length >= 2) {
        console.log("&&&&&&&&&&&")
        console.log(req.body.categories)
        const xmlfile = './Countries.xml';
        fs.readFile(xmlfile, 'utf8', function (error, text) {
            if (error) {
                res.status(500).send(`Problem: ${error}`);
            } else {
                try {
                    parser.parseString(text, function (err, result) {
                                                const countries = result['Countries']['Country'];
                        const countriesNames = countries.map((country) => country.Name[0]);
                        if (countriesNames.includes(req.body.country)) {
                            DButilsAzure.execQuery("INSERT INTO Users " +
                                "VALUES ('" + req.body.username + "', '" + req.body.password + "', '" + req.body.passQuestion + "', '" + req.body.city + "', '" +
                                req.body.country + "', '" + req.body.email + "', '" + req.body.firstName + "', '" + req.body.lastName + "');")
                                .then(function () { // adding all category per user
                                    for (var i = 0; i < req.body.categories.length; i++){
                                        DButilsAzure.execQuery("INSERT INTO CategoryOfUsers " +
                                            "VALUES ('"+ req.body.username + "', '" + req.body.categories[i] + "');")
                                            .then(function (){})
                                            .catch(function (err) {
                                            console.log(err)
                                            res.send(err)
                                        })
                                    }
                                })
                                .catch(function (err) {
                                    console.log(err)
                                    res.send(err)
                                })
                        } else {
                            res.status(400).send("Invalid country.");
                        }
                    });
                } catch (err) {
                    res.status(500).send(`problem: ${err}`);
                }
            }
        });

    } else {
        res.status(400).send("Invalid field.");
    }

}

function mostUpdatePois(req, res) {
    var username = req.decoded.username;
    DButilsAzure.execQuery("SELECT POI.* FROM POI, CategoryOfUsers " +
        "WHERE CategoryOfUsers.CategoryID = POI.CategoryID AND CategoryOfUsers.username='" + username + "' " +
        "order by POI.Rank DESC")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}

function lastSvaedPois(req, res) {
    var username = req.decoded.username;
    DButilsAzure.execQuery("SELECT top 2 POI.* FROM POI, Favorite " +
        "WHERE Favorite.NamePOI = POI.NamePOI AND Favorite.username='" + username + "' " +
        "order by Favorite.indexForUser DESC")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}

function getAllFavorites(req, res) {
    var username = req.decoded.username;
    DButilsAzure.execQuery("select POI.* from POI, Favorite " +
        "WHERE Favorite.username = '" + username + "' and Favorite.NamePOI = POI.NamePOI " +
        "ORDER BY Favorite.indexForUser DESC")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
}

function updateAllFavorites(req, res) {
    var username = req.decoded.username;
    for (var row = 0; row < req.body.length; row++) {
        if (req.body[row].modDate && req.body[row].NamePOI) {
            console.log(req.body[row].modDate)
            var date = moment(req.body[row].modDate, 'YYYY-MM-DD HH:mm:ss');
            if (!date.isValid()) {
                res.send("Invalid date. please enter a valid date.")
            }
            else{
                DButilsAzure.execQuery("DELETE FROM Favorite " +
                    "WHERE Favorite.username = '" + username + "';")
                    .then(function () {})
                    .catch(function (err) {
                        console.log(err)
                        res.send(err)
                    })
                for (var row = 0; row < req.body.length; row++) {
                    DButilsAzure.execQuery("INSERT INTO Favorite" +
                        " VALUES ('" + username + "', '" + req.body[row].NamePOI + "', '" + req.body[row].modDate + "');")
                        .then(function () {
                            res.send()
                        })
                        .catch(function (err) {
                            console.log(err)
                            res.send(err)
                        })
                }
            }
        }else{
            res.status(400).send("Missing fields.");
        }
    }



}

module.exports.login = login;
module.exports.register = register;
module.exports.mostUpdatePois = mostUpdatePois;
module.exports.lastSvaedPois = lastSvaedPois
module.exports.getAllFavorites = getAllFavorites
module.exports.updateAllFavorites = updateAllFavorites


