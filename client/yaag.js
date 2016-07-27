$.get("/apispecs.json", function(apidoc, status) {
	var routes = document.getElementById('routes');
	var payload = document.getElementById('payload');

	apidoc.ApiSpecs.forEach(function(specs, index) {
		var route = document.createElement('li');
		route.setAttribute('role', 'presentation');
		route.innerHTML = '<a href="#' + index + 'top" role="tab" data-toggle="tab">' + specs.HttpVerb + ' : ' + specs.Path + '</a>';
		routes.appendChild(route);
		var call = document.createElement('div');
		call.setAttribute('id', index + 'top');
		call.setAttribute('role', 'tabpanel');
		call.setAttribute('class', 'tab-pane col-md-10');
		var innerHTML = '';
		specs.Calls.forEach(function(apicall, index) {
			innerHTML += '<p><H4>Request Headers</H4></p>';
			innerHTML += '<table class="table table-bordered table-striped">';
			innerHTML += '<tr><th>Key</th><th>Value</th></tr>';
			for (var key in apicall.RequestHeader) {
				innerHTML += '<tr><td>' + key + '</td><td>  ' + apicall.RequestHeader[key] + '</td></tr>';
			}
			innerHTML += '</table>';
			innerHTML += '<p><h4> Response Code</h4></p>';
			innerHTML += '<pre class="prettyprint lang-json">' + apicall.ResponseCode + '</pre>';
			if (Object.keys(apicall.ResponseHeader).length > 0) {
				innerHTML += '<p><h4> Response Headers</h4></p>';
				innerHTML += '<table class="table table-bordered table-striped">';
				innerHTML += '<tr><th>Key</th><th>Value</th></tr>';
				for (var key in apicall.ResponseHeader) {
					innerHTML += '<tr><td>' + key + '</td><td>  ' + apicall.ResponseHeader[key] + '</td></tr>';
				}
				innerHTML += '</table>';
			}
			if (apicall.ResponseBody != "") {
				innerHTML += '<p> <H4> Response Body </H4> </p>';
				innerHTML += '<pre class="prettyprint lang-json">' + apicall.ResponseBody + '</pre><hr>';
			}
		});
		call.innerHTML = innerHTML;
		payload.appendChild(call);
	});
});