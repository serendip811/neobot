// controllers/index.js
var KeyboardModel = require('../models/keyboard');
var MessageService = require('../services/message');

module.exports = function(app)
{

    app.get('/', function (req, res) {
        res.send('Hello Chatbot!');
    });

    // GET keyboard
    app.get('/keyboard', function(req,res){
        KeyboardModel.findOne(function(err, keyboards){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(keyboards);
        });
    });

    // GET keyboard
    app.post('/message', function(req,res){
        var result = MessageService.process(req, function(result){
            res.json(result);
        });
    });

}