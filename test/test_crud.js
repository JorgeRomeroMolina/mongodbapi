

"use strict"

const cs = "mongodb://127.0.0.1:27017/local";
const collection = "test_crud";

let mongoapi = require("../lib/crud.js");
let mongo = new mongoapi(cs); 
let messages = [];


function Color(){};
Color.prototype.red = "\x1b[31m%s\x1b[0m ";
Color.prototype.yellow = "\x1b[33m%s\x1b[0m ";
Color.prototype.green = "\x1b[32m%s\x1b[0m ";
Color.prototype.blue = "\x1b[34m%s\x1b[0m ";
const color = new Color;


function print(){

	let msg = "";

	messages.forEach ( (item) => {

		if (item.status) console.log(color.green, "	" + item.message );
		else console.log(color.red, "	" + item.message );

	} );

	messages = [];

}



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



//MAIN
console.log("");
console.log(color.blue, "Testing insert method");
messages.push( test_insert_customError_connection() );
messages.push( test_insert_mandatoryParameters_collection() );
messages.push( test_insert_mandatoryParameters_document() );
messages.push( test_insert_oneDocument() );
messages.push( test_insert_manyDocument() );
print();

console.log("");
console.log(color.blue, "Testing read method");
messages.push( test_read_customError_connection() );
messages.push( test_read_mandatoryParameters_collection() );
messages.push ( test_read_getAll() );
messages.push ( test_read_queryWithFilter() );
messages.push ( test_read_queryWithProjection() );
messages.push ( test_read_queryWithModifier() );
messages.push ( test_read_queryOrderDesc() );
print();

console.log("");
console.log(color.blue, "Testing update method");
messages.push( test_update_customError_connection() );
messages.push( test_update_mandatoryParameters_collection() );
messages.push( test_update_manyDocuments() );
print();

console.log("");
console.log(color.blue, "Testing delete method");
messages.push( test_delete_customError_connection() );
messages.push( test_delete_mandatoryParameters_collection() );
messages.push( test_delete_deleteWithFilter() );
messages.push( test_delete_deleteAll() );
print();





function test_insert_customError_connection () {

	let passMsg = { status: true, message: "PASS: test_insert_customError_connection: The connection error was managed correctly" };
	let failMsg = { status: false, message: "FAIL: test_insert_customError_connection: The connection error was not managed correctly" };

	try {

		let mongo = new mongoapi("mongodb://127.0.0.1:2701777777777777787/local");
		let test = mongo.insert( { collection: collection, document: obj() } );
		return failMsg;

	} catch ( err ) {

		if ( ("code" in err) && (err.code === "err_mongodbapi_000") ) return passMsg;
		else return failMsg;

	}

}


function test_insert_mandatoryParameters_collection () {

	let passMsg = { status: true, message: "PASS: test_insert_mandatoryParameters_collection: The collection parameter was required correctly" };
	let failMsg = { status: false, message: "FAIL: test_insert_mandatoryParameters_collection: The collection parameter was not required correctly" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.insert( { document: obj() } );
		return failMsg;

	} catch ( err ) {

		if ( ("code" in err) && (err.code === "err_mongodbapi_004") ) return passMsg;
		else return failMsg;

	}

}


function test_insert_mandatoryParameters_document () {

	let passMsg = { status: true, message: "PASS: test_insert_mandatoryParameters_document: The document parameter was required correctly" };
	let failMsg = { status: false, message: "FAIL: test_insert_mandatoryParameters_document: The document parameter was not required correctly" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.insert( { collection: collection } );
		return failMsg;

	} catch ( err ) {

		if ( ("code" in err) && (err.code === "err_mongodbapi_004") ) return passMsg;
		else return failMsg;

	}

}


function test_insert_oneDocument () {

	let passMsg = { status: true, message: "PASS: test_insert_oneDocument: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_insert_oneDocument: Unexpected result" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.insert( { collection: collection, document: obj() } );
		return ( ("status" in test) && (test.status) && (test.insertedCount === 1) ) ? passMsg : failMsg;

	} catch ( err ) { return failMsg; }

}


function test_insert_manyDocument () {

	let passMsg = { status: true, message: "PASS: test_insert_manyDocument: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_insert_manyDocument: Unexpected result" };
	let objs = [];

	for ( let i=1; i<100; i++ ) {

		let auxObj = obj();
		auxObj.code = i;
		auxObj.text = "Text test " + i;
		auxObj.number = i;

		objs.push(auxObj);

	} 

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.insert( { collection: collection, document: objs } );
		return ( ("status" in test) && (test.status) && (test.insertedCount === 99) ) ? passMsg : failMsg;

	} catch ( err ) { return failMsg; }

}


function test_update_customError_connection () {

	let passMsg = { status: true, message: "PASS: test_update_customError_connection: The connection error was managed correctly" };
	let failMsg = { status: false, message: "FAIL: test_update_customError_connection: The connection error was not managed correctly" };

	try {

		let mongo = new mongoapi("mongodb://127.0.0.1:2701777777777777787/local");
		let test = mongo.update( { collection: collection, update: obj() } );
		return failMsg;

	} catch ( err ) {

		if ( ("code" in err) && (err.code === "err_mongodbapi_000") ) return passMsg;
		else return failMsg;

	}

}


function test_update_mandatoryParameters_collection () {

	let passMsg = { status: true, message: "PASS: test_update_mandatoryParameters_collection: The collection parameter was required correctly" };
	let failMsg = { status: false, message: "FAIL: test_update_mandatoryParameters_collection: The collection parameter was not required correctly" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.update( { filter: { code: 1 } } );
		return failMsg;

	} catch ( err ) {

		if ( ("code" in err) && (err.code === "err_mongodbapi_004") ) return passMsg;
		else return failMsg;

	}

}


function test_update_manyDocuments () {

	let passMsg = { status: true, message: "PASS: test_update_manyDocuments: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_update_manyDocuments: Unexpected result" };
	let objs = [];

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.update( { collection: collection, filter: { code: 0 }, update: { $set: { text: "Updated test 0" } } } );
		return ( ("status" in test) && (test.status) ) ? passMsg : failMsg;

	} catch ( err ) { return failMsg; }

}


function test_read_customError_connection () {

	let passMsg = { status: true, message: "PASS: test_read_customError_connection: The connection error was managed correctly" };
	let failMsg = { status: false, message: "FAIL: test_read_customError_connection: The connection error was not managed correctly" };

	try {

		let mongo = new mongoapi("mongodb://127.0.0.1:2701777777777777787/local");
		let test = mongo.read( { collection: collection } );
		return failMsg;

	} catch ( err ) {

		if ( ("code" in err) && (err.code === "err_mongodbapi_000") ) return passMsg;
		else return failMsg;

	}

}


function test_read_mandatoryParameters_collection () {

	let passMsg = { status: true, message: "PASS: test_read_mandatoryParameters_collection: The collection parameter was required correctly" };
	let failMsg = { status: false, message: "FAIL: test_read_mandatoryParameters_collection: The collection parameter was not required correctly" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.read( { document: obj() } );
		return failMsg;

	} catch ( err ) {

		if ( ("code" in err) && (err.code === "err_mongodbapi_002") ) return passMsg;
		else return failMsg;

	}

}


function test_read_getAll () {

	let passMsg = { status: true, message: "PASS: test_read_getAll: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_read_getAll: Unexpected result" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.read( { collection: collection } );
		return ( (test.length === 100) ) ? passMsg : failMsg;

	} catch ( err ) { failMsg; }

}

function test_read_queryWithFilter () {

	let passMsg = { status: true, message: "PASS: test_read_queryWithFilter: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_read_queryWithFilter: Unexpected result" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.read( { collection: collection, filter: { code: 1 } } );
		return ( (test.length === 1) ) ? passMsg : failMsg;

	} catch ( err ) { failMsg; }

}


function test_read_queryWithProjection () {

	let passMsg = { status: true, message: "PASS: test_read_queryWithProjection: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_read_queryWithProjection: Unexpected result" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.read( { collection: collection, projection: { _id: 0, code: 1 } } );
		return JSON.stringify( test[0] ) === JSON.stringify( { code: 0 } ) ? passMsg : failMsg;

	} catch ( err ) { failMsg; }

}

function test_read_queryWithModifier () {

	let passMsg = { status: true, message: "PASS: test_read_queryWithModifier: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_read_queryWithModifier: Unexpected result" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.read( { collection: collection, modifier: { limit: 1 } } );
		return ( (test.length === 1) && (test[0].code === 0) ) ? passMsg : failMsg;

	} catch ( err ) { failMsg; }

}


function test_read_queryOrderDesc () {

	let passMsg = { status: true, message: "PASS: test_read_queryOrderDesc: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_read_queryOrderDesc: Unexpected result" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.read( { collection: collection, modifier: { sort: { code: -1 } } } );
		return ( (test.length === 100) && (test[0].code === 99) ) ? passMsg : failMsg;

	} catch ( err ) { failMsg; }

}


function test_delete_customError_connection () {

	let passMsg = { status: true, message: "PASS: test_delete_customError_connection: The connection error was managed correctly" };
	let failMsg = { status: false, message: "FAIL: test_delete_customError_connection: The connection error was not managed correctly" };

	try {

		let mongo = new mongoapi("mongodb://127.0.0.1:2701777777777777787/local");
		let test = mongo.delete( { collection: collection } );
		return failMsg;

	} catch ( err ) {

		if ( ("code" in err) && (err.code === "err_mongodbapi_000") ) return passMsg;
		else return failMsg;

	}

}


function test_delete_mandatoryParameters_collection () {

	let passMsg = { status: true, message: "PASS: test_delete_mandatoryParameters_collection: The collection parameter was required correctly" };
	let failMsg = { status: false, message: "FAIL: test_delete_mandatoryParameters_collection: The collection parameter was not required correctly" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.delete( { filter: { code: 1 } } );
		return failMsg;

	} catch ( err ) {

		if ( ("code" in err) && (err.code === "err_mongodbapi_004") ) return passMsg;
		else return failMsg;

	}

}


function test_delete_deleteWithFilter () {

	let passMsg = { status: true, message: "PASS: test_delete_deleteWithFilter: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_delete_deleteWithFilter: Unexpected result" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.delete( { collection: collection, filter: { code: 1 } } );
		let test2 = mongo.read( { collection: collection } );
		return ( ("status" in test) && (test.status) && (test.deletedCount === 1) && (test2.length === 99) ) ? passMsg : failMsg;

	} catch ( err ) { return failMsg; }

}


function test_delete_deleteAll () {

	let passMsg = { status: true, message: "PASS: test_delete_deleteAll: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_delete_deleteAll: Unexpected result" };

	try {

		let mongo = new mongoapi(cs);
		let test = mongo.delete( { collection: collection } );
		let test2 = mongo.read( { collection: collection } );
		return ( ("status" in test) && (test.status)  && (test2.length === 0) && (test.deletedCount === 99) ) ? passMsg : failMsg;

	} catch ( err ) { return failMsg; }

}