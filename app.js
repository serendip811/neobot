var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

mongoose.Promise = require('bluebird');
global.appRoot = path.resolve(__dirname);

var app = express();

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 3000;

// [CONFIGURE ROUTER]
var router = require('./controllers')(app);

// [RUN SERVER]
var server = app.listen(port, function(){
	console.log("Express server has started on port " + port)
});

var firebase = require("firebase");

var config = {
	apiKey: "AIzaSyACMwQ-XUgtDkNmtE6iWSiYWxu8m2ffE_8",
	authDomain: "serendip-test.firebaseapp.com",
	databaseURL: "https://serendip-test.firebaseio.com",
	projectId: "serendip-test",
	storageBucket: "serendip-test.appspot.com",
	messagingSenderId: "699720679397"
};
firebase.initializeApp(config);

// [ CONFIGURE mongoose ]
// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://serendip:serendip@ds161069.mlab.com:61069/heroku_p6l2wmhv');
