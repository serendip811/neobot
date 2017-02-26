// services/button.js
var KeyboardModel = require('../models/keyboard');

exports.getKeyboard = function(callback){
    console.log("Button getKeyboard");

    KeyboardModel.findOne(function(err, keyboards){
        if(err) return res.status(500).send({error: 'database failure'});
        callback(keyboards);
    });
};