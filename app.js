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

app.post('/login', function (req, res) {
    if(req.body.username && req.body.password) {
        DButilsAzure.execQuery("SELECT * FROM Users WHERE Users.Username= '" + req.body.username + "' AND " + "Users.Password= '" + req.body.password + "'")
            .then(function (result) {
                if (result.length > 0) {
                    payload = {username: req.body.username};
                    options = {expiresIn: "1d"};
                    const token = jwt.sign(payload, secret, options);
                    res.send(token);
                } else {
                    res.status(401).send("Access denied. No such username or password.");
                }
            })
            .catch(function (err) {
                console.log(err)
                res.send(err)
                res.send("login Error")
            })
    }
    else{
        res.status(401).send("Expected username and password!");
    }
})

// app.post()
