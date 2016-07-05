mongodbapi
=================
mongodbapi is a [MongoDB](https://www.mongodb.org/) object modeling tool designed to work both asynchronous and synchronous environments.

Prerequisites
------------
  - [Node 4.4.2 or upper version](https://nodejs.org/en/)
  - [Mongodb](https://www.mongodb.com/)

Installation
------------
```sh
$ npm install mongodbapi
```

Overview
------------
You could create synchronous crud proccess to add, read, update and delete information from mongodb:    
```js
let mongoapi = require('mongocrud');
const cs = "mongodb://127.0.0.1:27017/local";
const collectionName = "test_crud";

try {

	let mongo = new mongoapi(cs);
	let result = mongo.read( { collection: collection } );
	console.log(result);

} catch ( err ) { 

	console.log(err);
	  
}
```

Or if you preffer asynchronous processes, you could create them by means of promises:  
```js
let mongoapi = require('mongocrudAsync');
const cs = "mongodb://127.0.0.1:27017/local";
const collectionName = "test_crudAsync";

let mongo = new mongoapi(cs);
mongo.read( { collection: collectionName } ).then( (result) => {

	console.log(result);

}, (err) => {

	console.log(err);

} );
```


