const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var DButilsAzure = require('./DButils');
app.use(express.json());

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});