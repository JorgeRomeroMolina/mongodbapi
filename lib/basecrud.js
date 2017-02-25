
"use strict";

const mongoClient = require('mongodb').MongoClient;

class basecrud {
	
	constructor (connectionString) { this.cs = connectionString; }
	
	connect () {
			
		return new Promise((resolve, reject) => {

			mongoClient.connect(this.cs, (err, db) => {
				
				if (err === null) { resolve(db); }
				else { reject(err); }
				
			});
		});
	}

	read (query, callback) {

		let cursor = null;
		let result = [];
		
		let collection = ('collection' in query) ? query.collection : null;
		let filter = ('filter' in query) ? query.filter : {};
		let projection = ('projection' in query) ? query.projection : {};
		let modifier = ('modifier' in query) ? query.modifier : {};
		
		if ( collection === null || collection === '' ) return callback( err_mongodbapi_002 () );
		
		this.connect().then( (db) => {

			cursor = db.collection(collection).find(filter);
			cursor.project(projection);
			if ('limit' in modifier) cursor.limit(modifier.limit);
			if ('skip' in modifier) cursor.skip(modifier.skip);
			if ('sort' in modifier) cursor.sort(modifier.sort);
			
			cursor.toArray( (err,docs) => {
				
				if (err != null) {

					callback( err_mongodbapi_003 (err) );
					db.close();
					
				}
				else {

					docs.forEach( (doc) => { result.push(doc); } );
					callback(null, result);
					db.close();
				}
				
			} );
			

		}).catch( (err) => {
			
			callback ( err_mongodbapi_000 (err) );
			
		});
			
	}

	aggregate (command, callback) {

		let cursor = null;
		let result = [];
		
		let collection = ('collection' in command) ? command.collection : null;
		let filter = ('pipeline' in command) ? command.pipeline : null;
		
		if ( collection === null || collection === '' ) return callback( err_mongodbapi_002 () );
		if ( filter === null || filter === '' ) return callback( err_mongodbapi_008 () );
		if( Object.prototype.toString.call( filter ) != '[object Array]' ) return callback( err_mongodbapi_009 () );
		
		this.connect().then( (db) => {

			cursor = db.collection(collection).aggregate(filter);
			cursor.toArray( (err,docs) => {
				
				if (err != null) {

					callback( err_mongodbapi_003 (err) );
					db.close();
					
				}
				else {

					docs.forEach( (doc) => { result.push(doc); } );
					callback(null, result);
					db.close();
				}
				
			} );
			

		}).catch( (err) => {
			callback ( err_mongodbapi_000 (err) );
			
		});
			
	}
	
	insert (command, callback) {
		
		let collection = ('collection' in command) ? command.collection : null;
		let document = ('document' in command) ? command.document : null;
		
		if ( collection === null || collection === '' ) return callback( err_mongodbapi_004 () );
		if ( document === null || document === '' ) return callback( err_mongodbapi_004 () );

		this.connect().then( (db) => { 
		
			if(Object.prototype.toString.call(document) === '[object Array]') {

				db.collection(collection).insertMany(document).then( (res) => {

					let response = {status:true, 'insertedCount':res.insertedCount, 'insertedId':res.insertedIds};
					callback(null, response);
					db.close();

				}).catch( (err) => {

					callback( err_mongodbapi_005 (err) );
					db.close();

				});

			}
			else {

				db.collection(collection).insertOne(document).then( (res) => {

					let response = {status:true, 'insertedCount':res.insertedCount, 'insertedId':[res.insertedId]};
					callback(null, response);
					db.close();

				}).catch( (err) => {

					callback( err_mongodbapi_005 (err) );
					db.close();

				});
			}
		
		
		}).catch( (err) => {

			callback ( err_mongodbapi_000 (err) );
		
		});
		
	}

	update (command, callback) {

		let collection = ('collection' in command) ? command.collection : null;
		let filter = ('filter' in command) ? command.filter : {};
		let update = ('update' in command) ? command.update : null;

		if ( collection === null || collection === '' ) return callback( err_mongodbapi_004 () );
		if ( update === null || update === '' ) return callback( err_mongodbapi_004 () );
		
		this.connect().then( (db) => {
		
			db.collection(collection).updateMany(filter, update).then( (res) => {

				let cursor = db.collection(collection).find(filter, { _id: 1 } );

				cursor.toArray( (err,docs) => {
				
					if (err != null) {
						
						callback( err_mongodbapi_007 (err) );
						db.close();
						
					}
					else {

						let result = [];
						docs.forEach( (doc) => { result.push(doc); } );
						let response = {'status':true , 'modifiedCount':res.modifiedCount, 'modifiedId':result};
						callback(null, response);
						db.close();
					}
					
				} );


			}).catch( (err) => {

				callback( err_mongodbapi_007 (err) );
				db.close();

			});
				

		}).catch( (err) => {

			callback ( err_mongodbapi_000 (err) );

		});
			

	}
	
	delete (command, callback) {

		let collection = ('collection' in command) ? command.collection : null;
		let filter = ('filter' in command) ? command.filter : null;
		
		if ( collection === null || collection === '' ) return callback( err_mongodbapi_004 () );

		this.connect().then((db) => {

			if (filter === null){

				db.collection(collection).deleteMany({}).then( (res) => {
					
					db.collection(collection).drop().then( (resDrop) => { 
					
						callback(null, {'status':resDrop , 'deletedCount':res.deletedCount } );
						db.close();
					
					}).catch( (err) => {
					
						callback( err_mongodbapi_006 (err) );
						db.close();
						
					});
					
				}).catch( (err) => {
					
					callback( err_mongodbapi_006 (err) );
					db.close();
					
				});

			}
			else {
				
				db.collection(collection).deleteMany(filter).then( (response) => {
					
					callback(null, {'status':true , 'deletedCount':response.deletedCount } );
					db.close();
					
				}).catch( (err) => {
				
					callback ( err_mongodbapi_006 (err) );
					db.close();
					
				});
			}

		}).catch( (err) => {
			
			callback ( err_mongodbapi_000 (err) );
			
		});

	}
	
}
module.exports = basecrud;


//Custom errors
function err_mongodbapi_000(mongoErr) {
	
	let err = new Error ();
	err.status = false;
	err.code = "err_mongodbapi_000";
	err.message = "Database connection failed";
	err.messageMongo = mongoErr;
	err.trace = err.stack;
	
	return err;
}

function err_mongodbapi_001 () {
	
	let err = new Error ();
	err.status = false;
	err.code = "err_mongodbapi_001";
	err.message = "Query object was not created correctly. Example: {collection: 'collectionName',filter: {code:98},projection: {_id:0,code:1,text:1},modifier: {limit:1,skip: 20,sort: {code: -1}}}";
	err.messageMongo = "";
	err.trace = err.stack;
	
	return err;

}

function err_mongodbapi_002 () {
	
	let err = new Error ();
	err.status = false;
	err.code = "err_mongodbapi_002";
	err.message = "Query object was not created correctly: collection field is mandatory";
	err.messageMongo = "";
	err.trace = err.stack;
	
	return err;

}

function err_mongodbapi_003 (mongoErr) {
	
	let err = new Error ();
	err.status = false;
	err.code = "err_mongodbapi_003";
	err.message = "There was error executing the query";
	err.messageMongo = mongoErr;
	err.trace = err.stack;
	
	return err;

}

function err_mongodbapi_004 () {
	
	let err = new Error ();
	err.status = false;
	err.code = "err_mongodbapi_004";
	err.message = "Command object was not created correctly: collection and document are mandatory field";
	err.messageMongo = "";
	err.trace = err.stack;
	
	return err;

}

function err_mongodbapi_005 (mongoErr) {
	
	let err = new Error ();
	err.status = false;
	err.code = "err_mongodbapi_005";
	err.message = "There was error executing the insert command";
	err.messageMongo = mongoErr;
	err.trace = err.stack;
	
	return err;
}

function err_mongodbapi_006 (mongoErr) {
	
	let err = new Error ();
	err.status = false;
	err.code = "err_mongodbapi_006";
	err.message = "There was a error executing the delete command";
	err.messageMongo = mongoErr;
	err.trace = err.stack;
	
	return err;
}


function err_mongodbapi_007 (mongoErr) {
	
	let err = new Error ();
	err.status = false;
	err.code = "err_mongodbapi_007";
	err.message = "There was a error executing the update command";
	err.messageMongo = mongoErr;
	err.trace = err.stack;
	
	return err;
}


function err_mongodbapi_008 () {
	
	let err = new Error ();
	err.status = false;
	err.code = "err_mongodbapi_008";
	err.message = "Query object was not created correctly: aggregate field is mandatory";
	err.messageMongo = "";
	err.trace = err.stack;
	
	return err;

}

function err_mongodbapi_009 () {
	
	let err = new Error ();
	err.status = false;
	err.code = "err_mongodbapi_009";
	err.message = "Query object was not created correctly: pipeline field must be an array";
	err.messageMongo = "";
	err.trace = err.stack;
	
	return err;

}









