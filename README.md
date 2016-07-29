# yaag-nodejs

under development

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Build status][appveyor-image]][appveyor-url] [![Coverage Status][coveralls-image]][coveralls-url]

## Installation

```sh
$ npm install yaag-nodejs
```

## Usage

####Use with default options

```js
var docGenerator = require('yaag-nodejs');
var app = require('express')();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(docGenerator());
```

####Use with custom options

```js
var docGenerator = require('yaag-nodejs');
var app = require('express')();
app.use(docGenerator());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(docGenerator({
	on: true,
	baseUrls: {
		Production: 'http://yaag-nodejs.com'
	},
	docTitle: 'Yaag API',
	docPath: '/yaagDocs'
}));
```


## Screenshots

#### API doc generated with default options
![alt first](https://raw.githubusercontent.com/akshaykumar12527/yaag-nodejs/master/1.png)

#### API doc generated with custom options
![alt first](https://raw.githubusercontent.com/akshaykumar12527/yaag-nodejs/master/2.png)

## Contributors 

* Akshay Kumar (akshaykumar12527@gmail.com)

## License

  [GNU](LICENSE)
  
[npm-url]: https://npmjs.org/package/yaag-nodejs
[downloads-image]: http://img.shields.io/npm/dm/yaag-nodejs.svg
[npm-image]: http://img.shields.io/npm/v/yaag-nodejs.svg
[travis-url]: https://travis-ci.org/akshaykumar12527/yaag-nodejs
[travis-image]: http://img.shields.io/travis/akshaykumar12527/yaag-nodejs.svg
[appveyor-image]:https://ci.appveyor.com/api/projects/status/bsu9w9ar8pboc2nj?svg=true
[appveyor-url]:https://ci.appveyor.com/project/akshaykumar12527/yaag-nodejs
[coveralls-url]:https://coveralls.io/r/akshaykumar12527/yaag-nodejs
[coveralls-image]:https://coveralls.io/repos/akshaykumar12527/yaag-nodejs/badge.png
