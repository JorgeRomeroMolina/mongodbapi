/*******************************************************************************************************************
										      DATA ACCESS OBJECT MONGODB
********************************************************************************************************************

https://docs.mongodb.org/manual/core/read-operations-introduction/


/*******************************************************************************************************************/

"use strict";

//references
const mongobase = require('./basecrud.js');


class mongocrudAsync extends mongobase {
	
	constructor (connectionString) { 
		
		super (connectionString); 
		
	}
	
	read (query) {
		
		return new Promise ( (resolve, reject) => {
			
			super.read (query, (err, result) => {

				if (err) reject(err);
				else resolve(result);
				
			});
			
		} );
		
	}

}
module.exports = mongocrudAsync;



