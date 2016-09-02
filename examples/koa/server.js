'use strict';
var route = require('koa-route');
var koa = require('koa');
var app = module.exports = koa();
var docGenerator = require('../../lib/koa/yaag');

app.use(docGenerator());
// app.use(docGenerator({
//     on: true,
//     baseUrls: {
//         Production: 'http://yaag-nodejs.com'
//     },
//     docTitle: 'Yaag API',
//     docPath: '/docs'
// }));

app.use(route.get('/test', function * (next) {
    if ('GET' != this.method)
        return yield next;
    this.body = this;
}));
app.use(route.post('/test', function * (next) {
     yield next;
    this.body = 'request';
}));

if (!module.parent) {
    app.listen(8080);
    console.log('listening on port 8080');
}
