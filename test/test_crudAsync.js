

"use strict"

const cs = "mongodb://127.0.0.1:27017/local";
const collection = "test_crudAsync";

let mongoapi = require("../lib/crudAsync.js");
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
test_insert_customError_connection().then( (response1) => {

	messages.push(response1);

	console.log("");
	console.log(color.blue, "Testing insert method");
	Promise.all([

    	test_insert_mandatoryParameters_collection(),
    	test_insert_mandatoryParameters_document(),
    	test_insert_oneDocument(),
    	test_insert_manyDocument()

	]).then( (responsesInsert) => {

		messages.push(responsesInsert[0]);
		messages.push(responsesInsert[1]);
		messages.push(responsesInsert[2]);
		messages.push(responsesInsert[3]);		
		print();

		console.log("");
		console.log(color.blue, "Testing read method");
		Promise.all([

			test_read_mandatoryParameters_collection(),
			test_read_getAll(),
			test_read_queryWithFilter(),
			test_read_queryWithProjection(),
			test_read_queryWithModifier(),
			test_read_queryOrderDesc()

		]).then( (responsesRead) => {

			messages.push(responsesRead[0]);
			messages.push(responsesRead[1]);
			messages.push(responsesRead[2]);
			messages.push(responsesRead[3]);
			messages.push(responsesRead[4]);
			messages.push(responsesRead[5]);		
			print();

			console.log("");
			console.log(color.blue, "Testing update method");
			Promise.all([

				test_update_mandatoryParameters_collection(),
				test_update_manyDocuments()

			]).then( (responsesUpdate) => {

				messages.push(responsesUpdate[0]);
				messages.push(responsesUpdate[1]);		
				print();

				console.log("");
				console.log(color.blue, "Testing delete method");
				Promise.all([

					test_delete_mandatoryParameters_collection(),
					test_delete_deleteWithFilter()

				]).then( (responsesDel) => {

					messages.push(responsesDel[0]);
					messages.push(responsesDel[1]);
					print();

					test_delete_deleteAll().then( (resultDelAll) => {

						messages.push(resultDelAll);
						print();

					}, (errDellAll) => {

						messages.push(errDelAll);
						print();

					} );

				}, (errDel) => {

					messages.push(errDel);
					print();

				} );

			}, (errUpdate) => {

				messages.push(errUpdate);
				print();

			} );

		}, (errRead) => {

			messages.push(errRead);
			print();

		} );

	}, (errInsert) => { 
	
		messages.push(errInsert);
		print(); 

	});

}, (errConnection) => {

	messages.push(errConnection);
	print();	

} );





function test_insert_customError_connection () {

	let passMsg = { status: true, message: "PASS: test_insert_customError_connection: The connection error was managed correctly" };
	let failMsg = { status: false, message: "FAIL: test_insert_customError_connection: The connection error was not managed correctly" };

	return new Promise ( (resolve, reject) => {

		let mongo = new mongoapi("mongodb://127.0.0.1:2701777777777777787/local");		
		mongo.insert( { collection: collection, document: obj() } ).then( (result) => {
			
			reject(failMsg);
		
		}, (err) => { resolve(passMsg); });

	} );

}


function test_insert_mandatoryParameters_collection () {

	let passMsg = { status: true, message: "PASS: test_insert_mandatoryParameters_collection: The collection parameter was required correctly" };
	let failMsg = { status: false, message: "FAIL: test_insert_mandatoryParameters_collection: The collection parameter was not required correctly" };

	return new Promise ( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.insert( { document: obj() } ).then( (result) => {

			reject(failMsg);

		}, (err) => {

			if ( ("code" in err) && (err.code === "err_mongodbapi_004") ) resolve(passMsg);
			else reject(failMsg);

		} );

	});

}


function test_insert_mandatoryParameters_document () {

	let passMsg = { status: true, message: "PASS: test_insert_mandatoryParameters_document: The document parameter was required correctly" };
	let failMsg = { status: false, message: "FAIL: test_insert_mandatoryParameters_document: The document parameter was not required correctly" };

	return new Promise ( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.insert( { collection: collection } ).then( (result) => {

			reject(failMsg);

		}, (err) => {

			if ( ("code" in err) && (err.code === "err_mongodbapi_004") ) resolve(passMsg);
			else reject(failMsg);

		} );

	});

}


function test_insert_oneDocument () {

	let passMsg = { status: true, message: "PASS: test_insert_oneDocument: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_insert_oneDocument: Unexpected result" };

	return new Promise ( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.insert( { collection: collection, document: obj() } ).then( (result) => {

			if ( ("status" in result) && (result.status) && (result.insertedCount === 1) ) resolve(passMsg);
			else reject(failMsg);

		}, (err) => { reject(failMsg); } );		

	} );

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

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.insert( { collection: collection, document: objs } ).then( (result) => {

			if ( ("status" in result) && (result.status) && (result.insertedCount === 99) ) resolve(passMsg);
			else reject(failMsg);

		}, (err) => {

			reject(failMsg);

		} );

	} );

}


function test_update_mandatoryParameters_collection () {

	let passMsg = { status: true, message: "PASS: test_update_mandatoryParameters_collection: The collection parameter was required correctly" };
	let failMsg = { status: false, message: "FAIL: test_update_mandatoryParameters_collection: The collection parameter was not required correctly" };

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.update( { filter: { code: 1 } } ).then( (result) => {

			reject(failMsg);

		}, (err) => {

			if ( ("code" in err) && (err.code === "err_mongodbapi_004") ) resolve(passMsg);
			else reject(failMsg);

		} );

	} );

}


function test_update_manyDocuments () {

	let passMsg = { status: true, message: "PASS: test_update_manyDocuments: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_update_manyDocuments: Unexpected result" };
	let objs = [];

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.update( { collection: collection, filter: { code: 0 }, update: { $set: { text: "Updated test 0" } } } ).then( (result) => {

			if ( ("status" in result) && (result.status) ) resolve(passMsg);
			else reject(failMsg);

		}, (err) => {

			reject(failMsg);

		} );

	} );

}


function test_read_mandatoryParameters_collection () {

	let passMsg = { status: true, message: "PASS: test_read_mandatoryParameters_collection: The collection parameter was required correctly" };
	let failMsg = { status: false, message: "FAIL: test_read_mandatoryParameters_collection: The collection parameter was not required correctly" };

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { document: obj() } ).then( (result) => {

			reject(failMsg);

		}, (err) => {

			if ( ("code" in err) && (err.code === "err_mongodbapi_002") ) resolve(passMsg);
			else reject(failMsg);

		} );

	} );

}


function test_read_getAll () {

	let passMsg = { status: true, message: "PASS: test_read_getAll: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_read_getAll: Unexpected result" };

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { collection: collection } ).then( (result) => {

			if ( (result.length === 100) ) resolve(passMsg);
			else reject(failMsg);


		}, (err) => {

			reject(failMsg);

		} );		

	} );

}

function test_read_queryWithFilter () {

	let passMsg = { status: true, message: "PASS: test_read_queryWithFilter: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_read_queryWithFilter: Unexpected result" };

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { collection: collection, filter: { code: 1 } } ).then( (result) => {

			if ( (result.length === 1) ) resolve(passMsg);
			else reject(failMsg);

		}, (err) => {

			reject(failMsg);			

		} );

	} );

}


function test_read_queryWithProjection () {

	let passMsg = { status: true, message: "PASS: test_read_queryWithProjection: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_read_queryWithProjection: Unexpected result" };

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { collection: collection, projection: { _id: 0, code: 1 } } ).then( (result) => {

			if ( JSON.stringify( result[0] ) === JSON.stringify( { code: 0 } ) ) resolve(passMsg);
			else reject(failMsg);

		}, (err) => {

			reject(failMsg);

		} );		

	} );

}

function test_read_queryWithModifier () {

	let passMsg = { status: true, message: "PASS: test_read_queryWithModifier: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_read_queryWithModifier: Unexpected result" };

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { collection: collection, modifier: { limit: 1 } } ).then( (result) => {

			if ( (result.length === 1) && (result[0].code === 0) ) resolve(passMsg);
			else reject(failMsg);

		}, (err) => {

			reject(failMsg);

		} );

	} );

}


function test_read_queryOrderDesc () {

	let passMsg = { status: true, message: "PASS: test_read_queryOrderDesc: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_read_queryOrderDesc: Unexpected result" };

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.read( { collection: collection, modifier: { sort: { code: -1 } } } ).then( (result) => {

			if ( (result.length === 100) && (result[0].code === 99) ) resolve(passMsg);
			else reject(failMsg);			

		}, (err) => {

			reject(failMsg);

		} );		

	} );

}


function test_delete_mandatoryParameters_collection () {

	let passMsg = { status: true, message: "PASS: test_delete_mandatoryParameters_collection: The collection parameter was required correctly" };
	let failMsg = { status: false, message: "FAIL: test_delete_mandatoryParameters_collection: The collection parameter was not required correctly" };

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.delete( { filter: { code: 1 } } ).then( (result) => {

			reject(failMsg);

		}, (err) => {

			if ( ("code" in err) && (err.code === "err_mongodbapi_004") ) resolve(passMsg);
			else reject(failMsg);			

		} );		

	} );

}


function test_delete_deleteWithFilter () {

	let passMsg = { status: true, message: "PASS: test_delete_deleteWithFilter: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_delete_deleteWithFilter: Unexpected result" };

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.delete( { collection: collection, filter: { code: 1 } } ).then( (resultDel) => {

			mongo.read( { collection: collection } ).then( (result) => {

				if ( ("status" in resultDel) && (resultDel.status) && (resultDel.deletedCount === 1) && (result.length === 99) ) resolve(passMsg);
				else reject(failMsg);

			}, (err) => {

				reject(failMsg);

			} );

		}, (err) => {

			reject(failMsg);

		} );

	} );

}


function test_delete_deleteAll () {

	let passMsg = { status: true, message: "PASS: test_delete_deleteAll: The result was satisfactory" };
	let failMsg = { status: false, message: "FAIL: test_delete_deleteAll: Unexpected result" };

	return new Promise( (resolve, reject) => {

		let mongo = new mongoapi(cs);
		mongo.delete( { collection: collection } ).then( (resultDel) => {

			mongo.read( { collection: collection } ).then( (result) => {

				if ( ("status" in resultDel) && (resultDel.status)  && (result.length === 0) && (resultDel.deletedCount === 99) ) resolve(passMsg);
				else reject(failMsg);

			}, (err) => {

				reject(failMsg);

			} );

		}, (err) => {

			reject(failMsg);

		} );

	} );

}