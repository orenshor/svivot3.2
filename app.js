const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var DButilsAzure = require('./DButils');

app.use(express.json());

var port = 3000;

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
secret = "IlayOren";

app.post('/login', function (req, res) { // Login and Hello
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
})

// {"userName": String, "password": String, "passQuestion":{"question": String, "answer": String},\
// "city": String, "country": String, "e-mail": String, "firstName" :String, "lastName": String, "fieldsOfInterests": []}

app.post('/register', function (req, res) {
    if(req.body.username && req.body.password && req.body.passQuestion && req.body.passAnswer && req.body.city &&
        req.body.country && req.body.email && req.body.firstName && req.body.lastName){
                DButilsAzure.execQuery("INSERT INTO Users VALUES ('" + req.body.username +"', '"+ req.body.password +"', '"+ req.body.passQuestion +"', '"+ req.body.passAnswer +"', '"+ req.body.city +"', '"+
                    req.body.country +"', '"+ req.body.email +"', '"+ req.body.firstName +"', '"+ req.body.lastName +"');")
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

})

app.post('/mostUpdatedPois', function (req, res) {
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
    }catch (exception) {
        res.status(400).send("Invalid token.");
    }
    var username = req.decoded.username;


    DButilsAzure.execQuery("SELECT * FROM Users WHERE Users.Username= '" + req.body.username + "' AND " + "Users.Password= '" + req.body.password + "'")
})


