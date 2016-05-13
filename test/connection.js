

//*****************************************************  REFERENCES  ******************************************
//const mongo = require('./lib/crud.js');
const mongoClient = require('mongodb').MongoClient;
const commandLineArgs = require('command-line-args');
const assert = require('assert');
//*************************************************************************************************************

var options = commandLineOptions();

var cs = "mongodb://" + options.url + ":" + options.port + "/"; 




mongoClient.connect(cs,function(err,db){
	
	assert.equal(err,null);
	console.log("connection string: " + cs);
	console.log("connection state: OK");
	db.close();
	
	connect1();
	
});

function connect1 () {
		
	return new Promise((resolve, reject) => {
console.log(cs);
		mongoClient.connect(cs, (err, db) => {
console.log("pasa");
			if (err === null) { resolve(db); }
			else { reject(err); }
			
		});
	});
	
}

function commandLineOptions(){
	
	var cli = commandLineArgs([
		{name: "url", alias: "u", type: String},
		{name: "port", alias: "p", type: String}
	]);
	
	var options = cli.parse();
	if(!(("url" in options)&&("port" in options))){
		console.log(cli.getUsage({
			title: "Usage",
			description: "The parameters u and p are required."
		}));
		process.exit();
	}
	
	return options; 
	
}
