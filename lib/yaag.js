exports = module.exports = createApplication;

function createApplication() {

	return generator;

};

var fs = require('fs');
var path = require('path');

var generator = function(req, res, next) {
	if (req.url == '/yaag') {
		console.log('yaag');
		var yaagJS = fs.readFileSync(path.normalize(__dirname + '/../client') + '/yaag.js');
		res.type('application/js');
		return res.send(yaagJS);
	} else if (req.url == '/docs.html') {
		console.log('docs.html')
		var yaagHTML = fs.readFileSync(path.normalize(__dirname + '/../client') + '/docs.html');
		res.type('html');
		return res.send(yaagHTML);
	} else if (req.url == '/apispecs.json') {
		var yaagJS = fs.readFileSync(path.normalize(__dirname + '/../client') + '/apispecs.json');
		res.type('application/json');
		return res.send(yaagJS);
	}


	var _res = res.send;
	var _body = res.body = {};
	res.send = function(body) {
		var apiSpecs = {

		};
		apiSpecs.HttpVerb = req.method;
		apiSpecs.Path = req.url;
		apiSpecs.Calls = [];
		_body = arguments[0];
		_res.apply(this, arguments);
		var call = {
			"Id": 1,
			"CurrentPath": req.url,
			"MethodType": req.method,
			"PostForm": null,
			"RequestHeader": req.headers,
			"CommonRequestHeaders": null,
			"ResponseHeader": {},
			"RequestUrlParams": {},
			"RequestBody": JSON.stringify(req.body),
			"ResponseBody": JSON.stringify(arguments[0]),
			"ResponseCode": this.statusCodes
		};
		apiSpecs.Calls.push(call);
		var specs = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/../client') + '/apispecs.json'))
		specs.ApiSpecs.push(apiSpecs);
		fs.writeFileSync(path.normalize(__dirname + '/../client') + '/apispecs.json'), JSON.stringify(specs));
	// _res.call(this, body);
};
next();
console.log("body", _body);
};