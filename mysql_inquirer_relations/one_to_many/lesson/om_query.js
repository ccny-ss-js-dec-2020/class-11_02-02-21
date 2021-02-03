/*
	We will be working with the one to many relationship between the
	'users' & 'blogs_posts' table.
	The 'users' table has been created
	The 'blog_post' table has not been created. Please see the schema.sql for the table creation schema.

	A user has many blog posts, a blog post only has one user
*/

//setup for connection database
const mysql = require('mysql');

//creating the connection to the database
const databaseConnection = mysql.createConnection(process.env.LOCAL_DATABASE);

//officially connecting to the mysql database
databaseConnection.connect();

/* lets use the username that we created in the last lesson, 'tali' */
function getUserAndRunApp(){
	/* Getting the users profile and logging it */
	databaseConnection.query("SELECT id FROM users where username='tali'", (userError, userResult) => {
		console.log(userResult);
		// storing the user returned in a variable
		const user = userResult[0];

		/* Inserting a few records into blog posts for the user */
		insertBlogPostsForUser(user.id)
	});
}

/*
	Taking a userId as a parameter in this function
	You see when it's called above, we're inserting the user's id in which we're creating the blog posts for
*/
function insertBlogPostsForUser(userId){
	var blogPostNames = [
		"Pokemon and Teletubbies Should create a show together",
		"Who is the real Bob Saget?",
		"Are Brazil Nuts really good for you?"
	]

	/* Looping through the string array and inserting those into the database */
	blogPostNames.forEach((blogPost) => {
		databaseConnection.query("INSERT INTO blog_posts (post, user_id) VALUES ('"+blogPost+"', "+userId+")", function(err, res){
			try {
				if(err){
					throw new Error(err)
				}
				console.log("Record Inserted")
			} catch (e){
				console.log("Error: " + e);
			}
		})
	});
	// inserting the userId from above, inserted from the top function
	getUsersBlogPosts(userId);
}

/*
	Taking a userId as a parameter in this function
	You see when it's called above, we're inserting the user's id in which we're creating the blog posts for
*/
function getUsersBlogPosts(userId){
	databaseConnection.query("SELECT * FROM blog_posts WHERE user_id=" + userId, function(err, res){
		try {
			if(err){
				throw new Error(err)
			}
			console.log(res);
		} catch (e) {
			console.log("Error: " + e);
		} finally {
			/*
				closing the database connection here in the finally block
				because there is no more logic to run here
			*/
			databaseConnection.end();
		}
	})
}

/* Running the main function here which runs all of the other functions */
getUserAndRunApp();
