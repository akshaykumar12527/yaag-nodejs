module.exports = createApplication;

var fs = require('fs');
var path = require('path');
var send = require('koa-send');

var options = {
    on: true,
    baseUrls: {},
    docTitle: "API Documentation",
    docPath: "/docs.html"
};

var generator = function* generator(next) {
    var req = this.req;
    var res = this.res;

    if (Object.keys(options.baseUrls).length === 0 && options.baseUrls.constructor === Object) {
        options.baseUrls.Development = this.request.origin;
        var specs = JSON.parse(fs.readFileSync(path.join(__dirname + '/../../client') + '/apispecs.json'));
        specs.BaseUrls = options.baseUrls;
        specs.DocTitle = options.docTitle;
        fs.writeFileSync(path.join(__dirname + '/../../client') + '/apispecs.json', JSON.stringify(specs));
    }
    if (req.url == '/yaag') {
        this.type = 'application/js';
        yield send(this, '/yaag.js', {
            root: __dirname + '/../../client'
        });
    } else if (req.url == options.docPath) {
        this.type = 'html';
        yield send(this, this.path, {
            root: __dirname + '/../../client'
        });
    } else if (req.url == '/apispecs.json') {
        yield send(this, this.path, {
            root: __dirname + '/../../client'
        });
    }
    yield next;
    if (options.on) {
        //to be modified from here 
        console.log(this.body);

    }


};

function genrateApiCalls(req, res, chunk) {
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
    var specs = JSON.parse(fs.readFileSync(path.join(__dirname + '/../../client') + '/apispecs.json'));
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
    specs.BaseUrls = options.baseUrls;
    specs.DocTitle = options.docTitle;
    fs.writeFileSync(path.join(__dirname + '/../../client') + '/apispecs.json', JSON.stringify(specs));

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

function createApplication(opt) {
    if (opt) {
        options.on = opt.on || options.on;
        options.baseUrls = opt.baseUrls || options.baseUrls;
        options.docTitle = opt.docTitle || options.docTitle;
        options.docPath = opt.docPath || opt.docPath;
    }
    fs.stat(path.join(__dirname + '/../../client') + '/apispecs.json', function(err, stat) {

        if (err && err.code == 'ENOENT') {
            var specs = {
                "BaseUrls": {},
                "DocTitle": "",
                "ApiSpecs": []
            };
            fs.writeFileSync(path.join(__dirname + '/../../client') + '/apispecs.json', JSON.stringify(specs));
        } else if (err) {
            throw err;
        }
    });
    return generator;
};