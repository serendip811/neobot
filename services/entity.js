// services/entity.js
var EntityModel = require('../models/entity');

exports.getEntity = function(entity_key, callback){
    console.log('Entity getEntity');
    EntityModel.findOne({key : entity_key}, function(err, entity){
        if(err) return res.status(500).send({error: 'database failure'});
        callback(entity);
    });
}

exports.recognition = function(nouns, callback){
    console.log('Entity Recognition');

    var itemProcessed = 0;
    var expect_entities = [];
    nouns.forEach(function(value){
    	EntityModel.find({values : {$elemMatch : {key : value}}}, {key : 1, name : 1, values : {$elemMatch : {key : value}}}, function(err, entities){
    		if(err) return res.status(500).send({error: 'database failure'});

	        for(var entity_idx in entities){
	        	var expect_entity = {};
	        	var entity = entities[entity_idx];
	        	expect_entity.key = entity.key;
	        	expect_entity.name = entity.name;
	        	expect_entity.value = entity.get("values")[0].value;
	        	expect_entities.push(expect_entity);
	        }

			itemProcessed++;
    		if(itemProcessed === nouns.length){
    			callback(expect_entities);
    		}
    	});
    });

};
