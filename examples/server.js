var express = require('express');
var app = express();
var docGenerator = require('./../');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(docGenerator());
var router = express.Router();
app.use('/api', router);
router.route('/test')
	.get(function(req, res) {
		res.send({
			'test': false
		});
	});
app.post('/test', function(req, res) {
	res.send(200);
});
app.listen(8080);
console.log('server listening on 8080');