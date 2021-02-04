/* <------------------------------------------------------------------> */

//set up the connection for the database here

/* <------------------------------------------------------------------> */

/*

	1. Use an inquirer prompt to ask the user to input their username
	2. Check if the username exists or not, print out a message if it does not exist
	3. If the username does exist, then prompt the user to
    a. see all of their blog posts
    b. create a blog post
	4. If they choose to see all of their blog posts, print them out nicely in the console
  5. If they choose to create a blog post, prompt the user correctly to have them create a blog post
*/
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
      inquirer.prompt([
        {
          type: "list",
          message: "What would you like to do?",
          choices: ["See All Blog Posts", "Create Blog Post"],
          name: "choice"
        }
      ]).then(function(blog_post){
        if(blog_post.choice == "See All Blog Posts"){
          databaseConnection.query('SELECT * FROM blog_posts WHERE user_id=' + result[0].id, (error,queryResTwo) => {
            if(queryResTwo.length > 0){
              console.log("Posts for " + result[0].first_name);
              queryResTwo.forEach((post, index) => {
                console.log((index + 1) + ". " + post.post);
              })
              databaseConnection.end();
            } else {
              console.log(result[0].first_name + ", Please create blog posts");
              databaseConnection.end();
            }
          });
        } else {
          inquirer.prompt([
            {
              type: "input",
              message: "What would you like the title of the blog post to be?",
              name: "title"
            }
          ]).then(function(blog_post){
            const insertBlogPostQuery = "INSERT INTO blog_posts (post, user_id) VALUES ('"+blog_post.title+"','"+result[0].id+"')";
            databaseConnection.query(insertBlogPostQuery, function(err, data){
              if(err){
                throw new Error(err)
              }
              console.log("New Blog Post Inserted")
              databaseConnection.end();
            })
          });
        }
      });
		} else {
			console.log("Username doesn't exist");
			databaseConnection.end();
		}
	});
});
