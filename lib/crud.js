/*******************************************************************************************************************
										      DATA ACCESS OBJECT MONGODB
********************************************************************************************************************

https://docs.mongodb.org/manual/core/read-operations-introduction/


/*******************************************************************************************************************/

"use strict";

//references
const mongobase = require('./basecrud.js');


class mongocrud extends mongobase {
	
	constructor (connectionString) { 
		
		super (connectionString); 
		
	}
	
	read (query) {
		
		var data = null;
		
		super.read (query, (err, result) => { 
		
			if (err) data = err;
			else data = result; 
			
		});
		
		while (data === null){ require('deasync').sleep(10); }
		
		if (data instanceof Error) throw data;
		else return data;
			
	}
	
	insert (command) {
		
		var response = null;
		
		super.insert (command, (err, result) => {

			if (err) response = err;
			else response = result;
			
		});
		
		while (response === null){ require('deasync').sleep(10); }
		
		if (response instanceof Error) throw response;
		else return response;
		
	}

	update (command) {

		var response = null;
		
		super.update (command, (err, result) => {

			if (err) response = err;
			else response = result;
			
		});
		
		while (response === null){ require('deasync').sleep(10); }
		
		if (response instanceof Error) throw response;
		else return response;

	}
	
	delete (filter) {
		
		var response = null;
		
		super.delete (filter, (err, result) => {

			if (err) response = err;
			else response = result;
			
		});
		
		while (response === null){ require('deasync').sleep(10); }
		
		if (response instanceof Error) throw response;
		else return response;
		
	}
	
}
module.exports = mongocrud;










