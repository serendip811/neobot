// services/context.js
var ContextModel = require('../models/context');

// Context를 가져온다
exports.getContext = function(user_key, callback){
    console.log("Context getContext");

    ContextModel.findOne({user_key : user_key}, function(err, context){
        if(!context){
            context = {
                user_key : user_key,
                intent : {},
                entities : [],
            }
        }
	    callback(context);
    });
}

exports.setContext = function(user_key, intent, entities, callback){
    console.log("Context setContext");

    var context = new ContextModel({
    	user_key : user_key,
    	intent:"intent",
    	entities : ["asdf", "asdf"]
    });
    console.log(context);
    context.save(function(err){
    	if(err) return console.error("err");
    	callback();
    });
}