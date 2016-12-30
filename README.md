mongodbapi
=================
Mongodbapi is a [MongoDB](https://www.mongodb.org/) interface designed to create CRUD operations (create, read, update and delete [documents](https://docs.mongodb.com/manual/core/document/#bson-document-format)).


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
Managing docs with mongodbapi is very easy, you just need to create a mongo object passing a connection string, and then executing a CRUD operator:    
```js
let mongoapi = require('mongodbapi');

const connection = 'mongodb://127.0.0.1:27017/local';
let mongo = new mongoapi(connection);

let command = { collection: 'test' };
mongo.read(command).then( (result) => {

    console.log(result);

}, (err) => {

    console.log(err);

} );
```

[Please click here for complete document](http://termylab.ddns.net:1000)
