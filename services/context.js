// services/context.js
var ContextModel = require('../models/context');

// Context를 가져온다
exports.getContext = function(user_key, callback){
    console.log("Context getContext");

    context = {};

    callback(context);

}