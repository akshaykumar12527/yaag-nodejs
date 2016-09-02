var express = require('express');
var app = express();
var docGenerator = require('./../');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
// app.use(docGenerator());
app.use(docGenerator({
	on: true,
	baseUrls: {
		Production: 'http://yaag-nodejs.com'
	},
	docTitle: 'Yaag API',
	docPath: '/yaagDocs'
}));
var router = express.Router();
app.use('/api', router);
router.route('/test')
	.get(function(req, res) {
		res.send({
			'test': false
		});
	})
   .post(function(req, res) {
	if (req.body.test == 10) {
		res.send(200)
	} else {
		res.send(400);
	}

});
app.listen(8080);
console.log('server listening on 8080');