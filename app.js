const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var DButilsAzure = require('./DButils');
app.use(express.json());

var port = 3000;
secret = "IlayOren";
const userModules = require("./UsersModules");
const poiModules = require("./PoiModules");

// USERS MOUDLES
app.post('/login', function (req, res) { userModules.login(req,res);})

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

app.post('/register', function (req, res) { userModules.register(req,res);})

app.post('/private/mostUpdatedPois', function (req, res) { userModules.mostUpdatePois(req,res); })

app.post('/private/lastSavedPois', function (req, res) { userModules.lastSavedPois(req,res); })

app.post('/private/getAllFavorites', function (req, res) { userModules.getAllFavorites(req,res); })

app.put('/private/updateAllFavorites', function (req, res) { userModules.updateAllFavorites(req,res); })

app.post('/RestorePassword',function(req,res){ userModules.RestorePassword(req,res); })



// POIS MOUDLES
app.get('/sortByCategory', function (req, res) { poiModules.sortByCategory(req,res); })

app.get('/orderByRank', function (req, res) { poiModules.orderByRank(req,res); })

app.get('/searchByName', function (req, res) { poiModules.searchByName(req,res); })

app.put('/addRank', function (req, res) { poiModules.addRank(req,res); })

app.put('/addOneView', function (req, res) { poiModules.addOneView(req,res); })

app.put('/private/addReview', function (req, res) { poiModules.addReview(req,res); })

app.get('/getRandomPOI', function (req, res) { poiModules.getRandomPOI(req,res); })





// PORT LISTENER
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});