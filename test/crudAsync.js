

"use strict"

const cs = "mongodb://127.0.0.1:27017/local";
const collection = "test_crudAsync";

let assert = require('chai').assert;
let mongoapi = require("../lib/crudAsync.js");
let mongo = new mongoapi(cs); 


function obj(){
	return {
		"code": 0,
		"text": "Text test 0",
		"number": 0,
		"date": new Date(),
		"text_array": ["Text array one","Text array two","Text array three"],
		"number_array": [1,2,3],
		"object_array": [
			{"oa1": "oa1", "oa2": 2},
			{"oa1": "oa11", "oa2": 22}
		],
		"object": {
			"o1": "Object 1",
			"o2": 2
		}
	};
}



describe('Testing method insert', () => {

	it('Checking connection error', () => {
		return test_insert_customError_connection().then( (response) => {
			assert.typeOf(response, 'error');
			assert.property(response, 'code');
			assert.equal(response.code, 'err_mongodbapi_000');
			assert.property(response, 'status');
			assert.equal(response.status, false);
		} );
	} );

	it('Checking mandatory fields error in collection parameter', () => {
		return test_insert_mandatoryParameters_collection().then( (response) => {
			assert.typeOf(response, 'error');
			assert.property(response, 'code');
			assert.equal(response.code, 'err_mongodbapi_004');
			assert.property(response, 'status');
			assert.equal(response.status, false);
		} );
	});

	it('Checking mandatory fields error in document parameter', () => {
		return test_insert_mandatoryParameters_document().then( (response) => {
			assert.typeOf(response, 'error');
			assert.property(response, 'code');
			assert.equal(response.code, 'err_mongodbapi_004');
			assert.property(response, 'status');
			assert.equal(response.status, false);
		} );
	});

	it('Inserting one document', () => {
		return test_insert_oneDocument().then( (response) => {
			assert.typeOf(response, 'object');
			assert.property(response, 'status');
			assert.equal(response.status, true);
			assert.property(response, 'insertedCount');
			assert.equal(response.insertedCount, 1); 
		} );
	});

	it('Inserting 100 documents', () => {
		return test_insert_manyDocument().then( (response) => {
			assert.typeOf(response, 'object');
			assert.property(response, 'status');
			assert.equal(response.status, true);
			assert.property(response, 'insertedCount');
			assert.isAtLeast(response.insertedCount, 2); 
		} );
	});
});

describe('Testing method update', () => {

	it('Checking mandatory fields error in collection parameter', () => {
		return test_update_mandatoryParameters_collection().then( (response) => {
			assert.typeOf(response, 'error');
			assert.property(response, 'code');
			assert.equal(response.code, 'err_mongodbapi_004');
			assert.property(response, 'status');
			assert.equal(response.status, false);
		} );
	});

	it('Updating many documents', () => {
		return test_update_manyDocuments().then( (response) => {
			assert.typeOf(response, 'object');
			assert.property(response, 'status');
			assert.equal(response.status, true);
			assert.property(response, 'modifiedCount');
			assert.equal(response.modifiedCount, 1);
			assert.property(response, 'modifiedId');
		} );
	});
});

describe('Testing method read', () => {

	it('Checking mandatory fields error in collection parameter', () => {
		return test_read_mandatoryParameters_collection().then( (response) => {
			assert.typeOf(response, 'error');
			assert.property(response, 'code');
			assert.equal(response.code, 'err_mongodbapi_002');
			assert.property(response, 'status');
			assert.equal(response.status, false);
		} );
	});

	it('Getting all documents', () => {
		return test_read_getAll().then( (response) => {
			assert.typeOf(response, 'Array');
			assert.equal(response.length, 100); 
		} );
	});

	it('Getting 1 document', () => {
		return test_read_queryWithFilter().then( (response) => {
			assert.typeOf(response, 'Array');
			assert.equal(response.length, 1); 
		} );
	});

	it('Getting the code value', () => {
		return test_read_queryWithProjection().then( (response) => {
			assert.typeOf(response, 'Array');
			assert.equal(response.length, 100); 
			assert.property(response[0], 'code');
		} );
	});

	it('Getting documents with limit 1', () => {
		return test_read_queryWithModifier().then( (response) => {
			assert.typeOf(response, 'Array');
			assert.equal(response.length, 1); 
		} );
	});

	it('Getting documents with order by code', () => {
		return test_read_queryOrderDesc().then( (response) => {
			assert.typeOf(response, 'Array');
			assert.equal(response.length, 100);
			assert.property(response[0], 'code');
			assert.equal(response[0].code, 99)
		} );
	});

});

describe('Testing method delete', () => {

	it('Checking connection error', () => {
		return test_insert_customError_connection().then( (response) => {
			assert.typeOf(response, 'error');
			assert.property(response, 'code');
			assert.equal(response.code, 'err_mongodbapi_000');
			assert.property(response, 'status');
			assert.equal(response.status, false);
		} );
	} );

	it('Checking mandatory fields error in collection parameter', () => {
		return test_delete_mandatoryParameters_collection().then( (response) => {
			assert.typeOf(response, 'error');
			assert.property(response, 'code');
			assert.equal(response.code, 'err_mongodbapi_004');
			assert.property(response, 'status');
			assert.equal(response.status, false);
		} );
	});

	it('Deleting with filter', () => {
		return test_delete_deleteWithFilter().then( (response) => {
			assert.typeOf(response, 'object');
			assert.property(response, 'status');
			assert.equal(response.status, true);
			assert.property(response, 'deletedCount');
			assert.equal(response.deletedCount, 1); 
		} );
	});

	it('Deleting full document', () => {
		return test_delete_deleteAll().then( (response) => {
			assert.typeOf(response, 'object');
			assert.property(response, 'status');
			assert.equal(response.status, true);
			assert.property(response, 'deletedCount');
			assert.isAtLeast(response.deletedCount, 2); 
		} );
	});

});



function test_insert_customError_connection () {

	return new Promise ( (resolve, reject) => {

		let mongo = new mongoapi("mongodb://127.0.0.1:2701777777777777787/local");		
		mongo.insert( { collection: collection, document: obj() } ).then( (result) => {

			reject(result);
		
		}, (err) => { resolve(err); });

	} );

}


function test_insert_mandatoryParameters_collection () {

	return new Promise ( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.insert( { document: obj() } ).then( (result) => {

			reject(result);

		}, (err) => {

			resolve(err);

		} );

	});

}


function test_insert_mandatoryParameters_document () {

	return new Promise ( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.insert( { collection: collection } ).then( (result) => {

			reject(result);

		}, (err) => {

			resolve(err);

		} );

	});

}


function test_insert_oneDocument () {

	return new Promise ( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.insert( { collection: collection, document: obj() } ).then( (result) => {

			resolve(result);

		}, (err) => { reject(err); } );		

	} );

}


function test_insert_manyDocument () {

	let objs = [];

	for ( let i=1; i<100; i++ ) {

		let auxObj = obj();
		auxObj.code = i;
		auxObj.text = "Text test " + i;
		auxObj.number = i;

		objs.push(auxObj);
	} 

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.insert( { collection: collection, document: objs } ).then( (result) => {

			resolve(result);

		}, (err) => {

			reject(err);

		} );

	} );

}


function test_update_mandatoryParameters_collection () {

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.update( { filter: { code: 1 } } ).then( (result) => {

			reject(result);

		}, (err) => {

			resolve(err);

		} );

	} );

}

function test_update_oneDocuments () {

	let objs = [];

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.update( { collection: collection, filter: { code: 0 }, update: { $set: { text: "Updated test 0" } } } ).then( (result) => {

			resolve(result);

		}, (err) => {

			reject(err);

		} );

	} );

}


function test_update_manyDocuments () {

	let objs = [];

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.update( { collection: collection, filter: { code: 0 }, update: { $set: { text: "Updated test 0" } } } ).then( (result) => {

			resolve(result);

		}, (err) => {

			reject(err);

		} );

	} );

}


function test_read_mandatoryParameters_collection () {

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { document: obj() } ).then( (result) => {

			reject(result);

		}, (err) => {

			resolve(err);

		} );

	} );

}


function test_read_getAll () {

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { collection: collection } ).then( (result) => {

			resolve(result);

		}, (err) => {

			reject(err);

		} );		

	} );

}

function test_read_queryWithFilter () {

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { collection: collection, filter: { code: 1 } } ).then( (result) => {

			resolve(result);

		}, (err) => {

			reject(err);			

		} );

	} );

}


function test_read_queryWithProjection () {

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { collection: collection, projection: { _id: 0, code: 1 } } ).then( (result) => {

			resolve(result);

		}, (err) => {

			reject(err);

		} );		

	} );

}

function test_read_queryWithModifier () {

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { collection: collection, modifier: { limit: 1 } } ).then( (result) => {

			resolve(result);

		}, (err) => {

			reject(err);

		} );

	} );

}


function test_read_queryOrderDesc () {

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { collection: collection, modifier: { sort: { code: -1 } } } ).then( (result) => {

			resolve(result);	

		}, (err) => {

			reject(err);

		} );		

	} );

}


function test_delete_mandatoryParameters_collection () {

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.delete( { filter: { code: 1 } } ).then( (result) => {

			reject(result);

		}, (err) => {

			resolve(err);			

		} );		

	} );

}


function test_delete_deleteWithFilter () {

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.delete( { collection: collection, filter: { code: 1 } } ).then( (result) => {

			resolve(result);

		}, (err) => {

			reject(err);

		} );

	} );

}


function test_delete_deleteAll () {

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.delete( { collection: collection } ).then( (result) => {

			resolve(result);

		}, (err) => {

			reject(err);

		} );

	} );

}