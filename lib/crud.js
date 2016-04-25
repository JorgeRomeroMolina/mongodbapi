/*******************************************************************************************************************
										      DATA ACCESS OBJECT MONGODB
********************************************************************************************************************

/*******************************************************************************************************************/

/*REFERENCES*/
const constant = require('./config.js');
const mongoClient = require('mongodb').MongoClient;

/*CONFIG*/
const plugTrace = true;
const url = constant.host_db;


/***********************************************************************************************************************
*	PRIVATE FUNCTION: connect
*	DESCRIPTION: Create a new connection to mongodb
*	PARAMETERS: 
*	RESPONSE:
*		(promise) Connection mongodb object  
************************************************************************************************************************/
function connect() {

	return new Promise((resolve, reject) => {
		
		mongoClient.connect(url, (err, db) => {
			if (err === null) { resolve(db); }
			else { reject(err); }
		});
		
	});

}


/***********************************************************************************************************************
*	PUBLIC FUNCTION: read
*	DESCRIPTION: Find a collection
*	PARAMETERS: 
*		name: <string> collection's name
*		filter: <object> object to filter the search
*		projection: <object> 
*	RESPONSE:
*		(promise) query's result

*	RESPONSE:
*		<object> {'status':true, 'insertedCount':<integer>, 'insertedId':[<string>]}
*	FAIL RESPONSE:
*		<object> {'status':false, 'errorType':<string>, 'errorCode':<integer>, 'errorMsg':<string>}
************************************************************************************************************************/
function read(name, filter, projection) {

	var cursor = null;
	var result = [];
	var nodeCommand = '';
	var mongoCommand = '';
	var filterToString = '';
	
	return new Promise((resolve, reject)=>{
		
		connect().then((db)=>{
			
			if (Object.prototype.toString.call(filter) === '[object Array]'){
				filterToString = filter.map(function(item) { return JSON.stringify(item); });
			}
			else if(Object.prototype.toString.call(filter) === '[object Object]'){
				filterToString = JSON.stringify(filter);
			}
			else{
				filterToString = filter;
			}

			if(filter === undefined){
				cursor = db.collection(name).find();
				nodeCommand = 'db.collection("'+ name +'").find()';
				mongoCommand = 'db.' + name + '.find()';
			}
			else{ 
				
				cursor = db.collection(name).find(filter);
				nodeCommand = 'db.collection("'+ name +'").find('+ filterToString +')';
				mongoCommand = 'db.' + name + '.find('+ filterToString +')';
			}

			if(projection != undefined){
				cursor.project(projection);
				//nodeCommand = 'db.collection("'+ name +'").find("'+ filterToString +'")';
				mongoCommand = 'db.' + name + '.find('+ filterToString +',' + projection + ')';
			}

			cursor.each((err, doc)=>{
				if (doc != null) result.push(doc);  
				else { 
					resolve(result);
					trace(nodeCommand,mongoCommand,null,result);
					db.close(); 
				}
			});

		}).catch((err)=>{
			trace(command,err,null);
			reject(err);
		});
		
	});
	
}
module.exports.read = read;


/***********************************************************************************************************************
*	PUBLIC FUNCTION: insert
*	DESCRIPTION: To insert new documents into a collection 
*	PARAMETERS: 
*		name: <string> collection's name
*		doc: <json or array[json]> Document or array of documents to insert
*	RESPONSE:
*		<object> {'status':true, 'insertedCount':<integer>, 'insertedId':[<string>]}
*	FAIL RESPONSE:
*		<object> {'status':false, 'errorType':<string>, 'errorCode':<integer>, 'errorMsg':<string>}
************************************************************************************************************************/
function insert(name,doc){

	var nodeCommand = '';
	var mongoCommand = '';
	var response = null;

	return new Promise((resolve,reject)=>{
	
		connect().then((db)=>{

			if(Object.prototype.toString.call(doc) === '[object Array]') {

				var docToString = doc.map((item)=>{ return JSON.stringify(item); });
				nodeCommand = 'db.collection("'+ name +'").insertMany(' + docToString + ')';
				mongoCommand = 'db.' + name + '.insertMany(' + docToString + ')';

				db.collection(name).insertMany(doc).then((res)=>{

					response = {'status':true , 'insertedCount':res.insertedCount, 'insertedId':res.insertedIds};
					resolve(response);
					trace(nodeCommand,mongoCommand,null,response);
					db.close();

				}).catch((err)=>{

					response = {'status':false, 'errorType':err.name, 'errorCode':err.code, 'errorMsg': err.errmsg};
					reject(response);
					trace(nodeCommand,mongoCommand,response,null);
					db.close();

				});

			}
			else {

				nodeCommand = 'db.collection("'+ name +'").insertOne(' + JSON.stringify(doc) + ')';
				mongoCommand = 'db.' + name + '.insertOne(' + JSON.stringify(doc) + ')';

				db.collection(name).insertOne(doc).then((res)=>{

					response = {'status':true , 'insertedCount':res.insertedCount, 'insertedId':[res.insertedId]};
					resolve(response);
					trace(nodeCommand,mongoCommand,null,response);
					db.close();

				}).catch((err)=>{

					response = {'status':false, 'errorType':err.name, 'errorCode':err.code, 'errorMsg': err.errmsg};
					reject(response);
					trace(nodeCommand,mongoCommand,response,null);
					db.close();

				});
			}

		}).catch((err)=>{

			response = {'status':false, 'errorType':err.name, 'errorCode':0, 'errorMsg': err.message};
			trace(null,null,response,null);
			reject(response);

		});
		
	});
}
module.exports.insert = insert;

/***********************************************************************************************************************
*	PUBLIC FUNCTION: update
*	DESCRIPTION: To update a documents into a collection 
*	PARAMETERS: 
*		(string)name (collection's name)
*		(json or array[json])doc (Document or array of documents to insert)
*		(json)operator (modification command)
*	RESPONSE:
*		(promise) query's result
************************************************************************************************************************/
function update(name,doc,operator){

	var nodeCommand = '';
	var mongoCommand = '';
	var response = null;
	
	return new Promise((resolve,reject)=>{
		
		read(name,doc,{_id:1}).then((r)=>{
			
			connect().then((db)=>{
			
				doc = doc === null ? {} : doc;
				opearator = operator === undefined ? {} :  operator;
				
				if(r.length === 1){

					//Update one
					nodeCommand = 'db.collection("'+ name +'").updateOne(' + JSON.stringify(doc) + ',' + JSON.stringify(operator) + ')';
					mongoCommand = 'db.' + name + '.updateOne(' + JSON.stringify(doc) + ',' + JSON.stringify(operator) + ')';

					db.collection(name).updateOne(doc, operator).then((res)=>{

						response = {'status':true , 'modifiedCount':res.modifiedCount, 'modifiedId':r};
						resolve(response);
						trace(nodeCommand,mongoCommand,null,response);
						db.close();

					}).catch((err)=>{

						response = {'status':false, 'errorType':err.name, 'errorCode':err.code, 'errorMsg': err.errmsg};
						reject(response);
						trace(nodeCommand,mongoCommand,response,null);
						db.close();

					});			
				}
				else if(r.length > 1){
					
					//Update many
					nodeCommand = 'db.collection("'+ name +'").updateMany(' + JSON.stringify(doc) + ',' + JSON.stringify(operator) + ')';
					mongoCommand = 'db.' + name + '.updateMany(' + JSON.stringify(doc) + ',' + JSON.stringify(operator) + ')';

					db.collection(name).updateMany(doc, operator).then((res)=>{

						response = {'status':true , 'modifiedCount':res.modifiedCount, 'modifiedId':r};
						resolve(response);
						trace(nodeCommand,mongoCommand,null,response);
						db.close();

					}).catch((err)=>{

						response = {'status':false, 'errorType':err.name, 'errorCode':err.code, 'errorMsg': err.errmsg};
						reject(response);
						trace(nodeCommand,mongoCommand,response,null);
						db.close();

					});
					
				}
				else{
					
					response = {'status':true , 'modifiedCount':0, 'modifiedId':0};
					resolve(response);
					trace(nodeCommand,mongoCommand,null,response);
					db.close();
					
				}


			}).catch((err)=>{

				response = {'status':false, 'errorType':err.name, 'errorCode':0, 'errorMsg': err.message};
				trace(null,null,response,null);
				reject(response);

			});
			
		});

	});
}
module.exports.update = update;

/***********************************************************************************************************************
*	PUBLIC FUNCTION: replace
*	DESCRIPTION: To update a documents into a collection 
*	PARAMETERS: 
*		(string)name (collection's name)
*		(json or array[json])doc (Document or array of documents to insert)
*		(json)operator (modification command)
*		(bool)upsert (When true, if no documents match the filter, a new document is inserted based on the replacement document)
*	RESPONSE:
*		(promise) query's result
************************************************************************************************************************/
function replace(name,filter,doc,upsert){
	
	var nodeCommand = '';
	var mongoCommand = '';
	var response = null;
	var flagUpsert = false;
	
	return new Promise((resolve,reject)=>{
	
		connect().then((db)=>{
			
			//Replace one
			nodeCommand = 'db.collection("'+ name +'").replaceOne(' + JSON.stringify(doc) + ',' + JSON.stringify(operator) + ',{ upsert: true })';
			mongoCommand = 'db.' + name + '.replaceOne(' + JSON.stringify(doc) + ',' + JSON.stringify(operator) + ',{ upsert: true })';
			
			flagUpsert = upsert === true ? true : false;

			db.collection(name).replaceOne(doc, operator, { upsert: flagUpsert }).then((res)=>{

				response = {'status':true , 'modifiedCount':res.modifiedCount};
				resolve(response);
				trace(nodeCommand,mongoCommand,null,response);
				db.close();

			}).catch((err)=>{

				response = {'status':false, 'errorType':err.name, 'errorCode':err.code, 'errorMsg': err.errmsg};
				reject(response);
				trace(nodeCommand,mongoCommand,response,null);
				db.close();

			});
			
		}).catch((err)=>{

			response = {'status':false, 'errorType':err.name, 'errorCode':0, 'errorMsg': err.message};
			trace(null,null,response,null);
			reject(response);

		});
	});
	
}
module.exports.replace = replace;

/***********************************************************************************************************************
*	PUBLIC FUNCTION: drop
*	DESCRIPTION: To delete a docuemnt or set of documentos
*	PARAMETERS: 
*		(string)name (collection's name)
*		(json or array[json])doc (Document or array of documents to delete)
*	RESPONSE:
*		(string)Retorna el comando 
************************************************************************************************************************/
function drop(name,doc) {

	var nodeCommand = '';
	var mongoCommand = '';
	var response = null;
	
	return new Promise((resolve,reject)=>{
		
		connect().then((db)=>{

			if (doc === undefined){
				
				nodeCommand = 'db.collection("'+ name +'").deleteMany({})';
				mongoCommand = 'db.' + name + '.deletetMany()';

				db.collection(name).deleteMany({}).then((res)=>{
			
					response = {'status':true , 'deletedCount':res.deletedCount };
					resolve(response);
					trace(nodeCommand,mongoCommand,null,response);
					db.close();
					
				}).catch((err)=>{
					
					response = {'status':false, 'errorType':err.name, 'errorCode':err.code, 'errorMsg': err.errmsg};
					trace(nodeCommand,mongoCommand,response,null);
					reject(response);
					db.close();
					
				});

			}
			else if (Object.prototype.toString.call(doc) === '[object Array]') {

				var docToString = doc.map((item)=>{ return JSON.stringify(item); });
				nodeCommand = 'db.collection("'+ name +'").deleteMany(' + docToString + ')';
				mongoCommand = 'db.' + name + '.deletetMany(' + docToString + ')';
			
				db.collection(name).deleteMany(doc).then((response)=>{
					
					resolve(response);
					trace(nodeCommand,mongoCommand,response,null);
					db.close();
					
				}).catch((err)=>{
					
					response = {'status':false, 'errorType':err.name, 'errorCode':err.code, 'errorMsg': err.errmsg};
					trace(nodeCommand,mongoCommand,response,null);
					reject(response);
					db.close();
					
				});

			}
			else {

				var docToString = doc.map((item)=>{ return JSON.stringify(item); });
				nodeCommand = 'db.collection("'+ name +'").deleteOne(' + docToString + ')';
				mongoCommand = 'db.' + name + '.deleteOne(' + docToString + ')';
				
				db.collection(name).deleteOne(doc).then((response)=>{
					
					resolve(response);
					trace(nodeCommand,mongoCommand,response,null);
					db.close();
					
				}).catch((err)=>{
				
					response = {'status':false, 'errorType':err.name, 'errorCode':err.code, 'errorMsg': err.errmsg};
					trace(nodeCommand,mongoCommand,response,null);
					reject(err);
					db.close();
					
				});
			}

		}).catch((err)=>{
			
			response = {'status':false, 'errorType':err.name, 'errorCode':0, 'errorMsg': err.message};
			trace(null,null,response,null);
			reject(err);
			
		});
	});
}
module.exports.delete = drop;


/***********************************************************************************************************************
*	PRIVATE FUNCTION: trace
*	DESCRIPTION: Escribe una traza de la última ejecución
*	PARAMETERS: 
*		(object)command
*		(object)err
*		(array[object])res
************************************************************************************************************************/
function Color(){};
Color.prototype.red = '\x1b[31m%s\x1b[0m ';
Color.prototype.yellow = '\x1b[33m%s\x1b[0m ';

function trace(command,mongoCommand,err,res) {  
	if(plugTrace===false) return;
	var color = new Color;

	console.log('');
	console.log(color.yellow,'**************************************  MONGODB TRACE  ***************************************');
	console.log('');
	console.log(color.yellow,'date:');
	console.log(new Date());
	console.log('');
	console.log(color.yellow,'node command:');
	console.log(command);
	console.log('');
	console.log(color.yellow,'mongo command:');
	console.log(mongoCommand);
	console.log('');
	if(err===null){ 
		if('insertedCount' in res){
			console.log(color.yellow,'inserted:');
			console.log(JSON.stringify(res));
		}
		else if('deletedCount' in res){
			console.log(color.yellow,'deleted:');
			console.log(res.deletedCount + " items");
		}
		else if('modifiedCount' in res){
			console.log(color.yellow,'modified:');
			console.log(res.modifiedCount + " items");
		}
		else{
			console.log(color.yellow,'response:');
			console.log(res.length + " items");
		}
	}
	else if(err!=null){
		console.log(color.yellow,'err:');
		console.log(err);
	}
	console.log('');
	console.log(color.yellow,'************************************  END MONGODB TRACE  *************************************');
	console.log('');
}
