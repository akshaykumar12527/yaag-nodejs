var http = require('http');
var fs = require('fs');
var path = require('path');
var statusCodes = http.STATUS_CODES;
var deprecate = require('depd')('yaag-nodejs');
var generator = function(req, res, next) {
	if (req.url == '/yaag') {
		res.type('application/js');
		return res.sendFile(path.normalize(__dirname + '/../client') + '/yaag.js');
	} else if (req.url == '/docs.html') {
		// console.log('docs.html')
		res.type('html');
		return res.sendFile(path.normalize(__dirname + '/../client') + '/docs.html');
	} else if (req.url == '/apispecs.json') {
		var yaagJS = fs.readFileSync(path.normalize(__dirname + '/../client') + '/apispecs.json');
		return res.send(JSON.parse(yaagJS));
	}
	var _res = res.send;
	// res.send = send;
	res.send = function(body) {
		_res.apply(this, arguments);
		// disambiguate res.send(status) and res.send(status, num)
		if (typeof body === 'number' && arguments.length === 1) {
			deprecate('res.send(status): Use res.sendStatus(status) instead');
			body = statusCodes[body];
		}
		if (typeof body === 'string') {
			generateHTML(this.req, this, body);
		}

	};
	next();
};

function generateHTML(req, res, chunk) {
	// console.log('chunk', chunk.toString());
	// console.log('req', req.body);
	var call = {
		"Id": 0,
		"CurrentPath": req.originalUrl,
		"MethodType": req.method,
		"PostForm": null,
		"RequestHeader": req.headers,
		"CommonRequestHeaders": null,
		"ResponseHeader": {
			'Content-Type': res.get('Content-Type')
		},
		"RequestUrlParams": req.query,
		"RequestBody": JSON.stringify(req.body),
		"ResponseBody": chunk.toString(),
		"ResponseCode": res.statusCode
	};
	var shouldAddPathSpec = true;
	var specs = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/../client') + '/apispecs.json'))
	specs.ApiSpecs.forEach(function(apiSpec, index) {
		if (apiSpec.Path == call.CurrentPath && apiSpec.HttpVerb == call.MethodType) {
			shouldAddPathSpec = false;
			call.Id = index;
			deleteCommonHeaders(call.RequestHeader);
			var avoid = false;
			apiSpec.Calls.forEach(function(currentApiCall) {
				if (call.RequestBody == currentApiCall.RequestBody &&
					call.ResponseCode == currentApiCall.ResponseCode &&
					call.ResponseBody == currentApiCall.ResponseBody) {
					avoid = true
				}
			});

			if (!avoid) {
				specs.ApiSpecs[index].Calls.push(call);
			}
		}
	});
	if (shouldAddPathSpec) {
		var apiSpecs = {};
		apiSpecs.HttpVerb = req.method;
		apiSpecs.Path = req.originalUrl;
		apiSpecs.Calls = [];
		deleteCommonHeaders(call.RequestHeader);
		apiSpecs.Calls.push(call);
		specs.ApiSpecs.push(apiSpecs);
	}
	fs.writeFileSync(path.normalize(__dirname + '/../client') + '/apispecs.json', JSON.stringify(specs))

}

function deleteCommonHeaders(headers) {
	delete headers["Accept"]
	delete headers["Accept-Encoding"]
	delete headers["Accept-Language"]
	delete headers["Cache-Control"]
	delete headers["Connection"]
	delete headers["Cookie"]
	delete headers["Origin"]
	delete headers["User-Agent"]
	delete headers["accept"]
	delete headers["accept-encoding"]
	delete headers["accept-language"]
	delete headers["cache-control"]
	delete headers["connection"]
	delete headers["cookie"]
	delete headers["origin"]
	delete headers["user-agent"]
	delete headers["postman-token"]
	return headers;
};


exports = module.exports = createApplication;

function createApplication() {

	return generator;

};