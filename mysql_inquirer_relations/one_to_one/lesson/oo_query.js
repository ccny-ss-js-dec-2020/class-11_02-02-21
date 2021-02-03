/*
	We will be working with the one to one relationship between the
	'users' & 'users_profiles' table.
	If you do not have these, the schema to create them is in the schema.sql

	Look at the use of functions here
	Look at the use of nesting here ... meaning, i'm waiting for one database call
	to be done before execusting another call on the database

	If we didn't use nesting, and had all of the query calls in the global scope,
	they would not go in order, they would all go off concurrently and possibly finish at different times depending on how long it takes to make the call.
	This is asynchronous behavior by javascript: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Concepts.
*/



//setup for connection database
const mysql = require('mysql');

//creating the connection to the database
const databaseConnection = mysql.createConnection(process.env.LOCAL_DATABASE);

//officially connecting to the mysql database
databaseConnection.connect();

function createUserAndRunApp(){
	/* Inserting a new record into the 'users' table */
	databaseConnection.query("INSERT INTO users (first_name, last_name, email, username, password) VALUES ('Tali', 'Baba', 'tali@yahoo.com', 'tali', 'baba')", function(err, data){
		try {
			if(err){
				throw new Error(err)
			}
			console.log("User Creation Successful");
			console.log("Creating Users Profile");
			createUsersProfile();
		} catch (e) {
			console.log("Error: " + e);
		}
	});
}
/* Main function being called right here, which calls all of the other functions */
createUserAndRunApp();

function createUsersProfile(){
	/* Inserting a record into the 'users_profiles' table for the user that we just created */
	databaseConnection.query("SELECT * FROM users WHERE username='tali'", function(err, res){
		const user = res[0];
		console.log(user)
		databaseConnection.query("INSERT INTO users_profiles (favorite_song, favorite_movie, favorite_pizza, user_id) VALUES ('Three Strange Days','The Departed','White Slice'," + user.id + ")", function(err, res){
			try {
				if(err){
					throw new Error(err)
				}
				console.log(user.first_name + "'s Profile Creation Successful")
				console.log("Here is what " + user.first_name + "'s profile looks like.")
				queryForUserProfile();
			} catch (e){
				console.log("Error: " + e);
			}
		});
	});
}

function queryForUserProfile(){
	/* Getting the users profile and logging it */
	databaseConnection.query("SELECT id FROM users where username='tali'", (userError, userResult) => {
		console.log(userResult);
		// storing the user returned in a variable
		const user = userResult[0];
		databaseConnection.query('SELECT * FROM users_profiles WHERE user_id=' + user.id, (err,res) => {
			console.log(res);

			/* once this query is done, we can close the connection since we're done with the logic */
			databaseConnection.end()
		});
	});
}
