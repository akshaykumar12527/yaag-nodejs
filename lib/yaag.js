exports = module.exports = createApplication;

function createApplication() {

	return generator;

};

var fs = require('fs');
var generator = function(req, res, next) {
	if (req.url == '/yaag') {
		console.log('yaag');
		var yaagJS = fs.readFileSync('../client/yaag.js');
		res.type('application/js');
		return res.send(yaagJS);
	} else if (req.url == '/docs.html') {
		console.log('docs.html')
		var yaagHTML = fs.readFileSync('../client/docs.html');
		res.type('html');
		return res.send(yaagHTML);
	}
	var _res = res.send;
	var _body = res.body = {};
	res.send = function(body) {
		_body = arguments[0];
		_res.apply(this, arguments);
		// _res.call(this, body);
	};
	next();
	console.log("body", _body);
};