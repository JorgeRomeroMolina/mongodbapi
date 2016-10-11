mongodbapi
=================
mongodbapi is a [MongoDB](https://www.mongodb.org/) object modeling tool designed to work in asynchronous environments.


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
You can create crud methods by means of promises:    
```js
let mongoapi = require('mongocrudAsync');
const connection = 'mongodb://127.0.0.1:27017/local';
const collectionName = 'test_crudAsync';

let mongo = new mongoapi(connection);
mongo.read( { collection: collectionName } ).then( (result) => {

    console.log(result);

}, (err) => {

    console.log(err);

} );
```
