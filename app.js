const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var DButilsAzure = require('./DButils');
app.use(express.json());

var port = 3000;
secret = "IlayOren";
const userMoudles = require("./UsersMoudles");
const poiMoudles = require("./PoiMoudles");

// USERS MOUDLES
app.post('/login', function (req, res) { userMoudles.login(req,res);})

app.use('/private', function (req, res, next) {
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
    next()
})

app.post('/register', function (req, res) { userMoudles.register(req,res);})

app.post('/private/mostUpdatedPois', function (req, res) { userMoudles.mostUpdatePois(req,res); })

app.post('/private/lastSavedPois', function (req, res) { userMoudles.lastSvaedPois(req,res); })

app.post('/private/getAllFavorites', function (req, res) { userMoudles.getAllFavorites(req,res); })

app.put('/private/updateAllFavorites', function (req, res) { userMoudles.updateAllFavorites(req,res); })



// POIS MOUDLES
app.get('/sortByCategory', function (req, res) { poiMoudles.sortByCategory(req,res); })

app.get('/orederByRank', function (req, res) { poiMoudles.orederByRank(req,res); })

app.get('/searchByName', function (req, res) { poiMoudles.searchByName(req,res); })

app.put('/addRank', function (req, res) { poiMoudles.addRank(req,res); })




// PORT LISTENER
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});