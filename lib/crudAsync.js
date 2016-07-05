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

	insert (command) {

		return new Promise ( (resolve, reject) => {

			super.insert (command, (err, result) => {

				if (err) reject(err);
				else resolve(result);
				
			});

		} );
		
	}

	update (command) {

		return new Promise ( (resolve, reject) => {

			super.update (command, (err, result) => {

				if (err) reject(err);
				else resolve(result);
				
			});

		} );

	}

	delete (filter) {

		return new Promise ( (resolve, reject) => {

			super.delete (filter, (err, result) => {

				if (err) reject(err);
				else resolve(result);

			});

		} );

	}

}
module.exports = mongocrudAsync;



