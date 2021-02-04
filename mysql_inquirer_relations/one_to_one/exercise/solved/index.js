//node modules to request
var mysql = require('mysql');
var inquirer = require('inquirer');

//creating the connection to the database
const databaseConnection = mysql.createConnection(process.env.LOCAL_DATABASE);

//officially connecting to the mysql database
databaseConnection.connect();

/* <------------------------------------------------------------------> */

inquirer.prompt([
	{
		type: "input",
		message: "What is your username?",
		name: "username",
	}
]).then((res) => {
	databaseConnection.query(`SELECT * FROM users WHERE username='${res.username}'`, (err, result) => {
		if(result.length > 0){
			databaseConnection.query('SELECT * FROM users_profiles WHERE user_id=' + result[0].id, (error,queryResTwo) => {
				if(queryResTwo.length > 0){
					console.log("Favorite Movie: " + queryResTwo[0].favorite_movie);
					console.log("Favorite Song: " + queryResTwo[0].favorite_song);
					console.log("Favorite Pizza Slice: " + queryResTwo[0].favorite_pizza);
					databaseConnection.end();
				} else {
					console.log(result[0].first_name + ", Please create a profile");
					databaseConnection.end();
				}
			});
		} else {
			console.log("Username doesn't exist");
			databaseConnection.end();
		}
	});
});
