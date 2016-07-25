exports = module.exports = createApplication;

function createApplication() {

  return generator;
  
};

var generator = function(req,res,next){
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

