/*
  1. Use Inquirer & MySql
  2. Prompt the user if they would like to select a performer or a performance
  3. If they choose to select a performer
    a. Dynamically create the performer choices for the user
    b. Whichever performer they select, print the performances for that performer
  4. If they choose to select a performance
    a. Dynamically create the performance choices for the user
    b. Whichever performance they select, print the performers in that performance
*/
//node modules to request
var mysql = require('mysql');
var inquirer = require('inquirer');

//creating the connection to the database
const databaseConnection = mysql.createConnection(process.env.LOCAL_DATABASE);

//officially connecting to the mysql database
databaseConnection.connect();

inquirer.prompt([
  {
    type: "list",
    message: "Performer or Performance?",
    choices: ["Performer", "Performance"],
    name: "choice"
  }
]).then(function(answer){
  if(answer.choice === "Performer"){
    selectPerformersPerformances();
  } else {
    selectPerformancesPerformers();
  }
});

function selectPerformersPerformances(){
  databaseConnection.query("SELECT * FROM performers", function(err, data){
    const performers = data.map((performer) => performer.name);
    inquirer.prompt([
      {
        type: "list",
        message: "Select a performer",
        choices: performers,
        name: "performer"
      }
    ]).then(function(answer){
      const performer = answer.performer
      let selectQuery = "SELECT performances.title FROM performers_performances "
      selectQuery += "INNER JOIN performances "
      selectQuery += "INNER JOIN performers "
      selectQuery += "ON performers_performances.performance_id=performances.id "
      selectQuery += "AND performers_performances.performer_id=performers.id "
      selectQuery += "WHERE performers.name='"+performer+"'";
      console.log("Getting all performances for " + performer);
      databaseConnection.query(selectQuery, function(err, data){
        try {
          if(err){
            throw new Error(err)
          }
          data.forEach((performance, index) => {
            console.log((index + 1) + ". " + performance.title)
          });
        } catch (e) {
          console.log(e)
        } finally {
          databaseConnection.end();
        }
      });
    })
  })
}

function selectPerformancesPerformers(){
  databaseConnection.query("SELECT * FROM performances", function(err, data){
    const performances = data.map((performance) => performance.title);
    inquirer.prompt([
      {
        type: "list",
        message: "Select a performance",
        choices: performances,
        name: "performance"
      }
    ]).then(function(answer){
      const performance = answer.performance;
      let selectQuery = "SELECT performers.name FROM performers_performances "
      selectQuery += "INNER JOIN performances "
      selectQuery += "INNER JOIN performers "
      selectQuery += "ON performers_performances.performance_id=performances.id "
      selectQuery += "AND performers_performances.performer_id=performers.id "
      selectQuery += "WHERE performances.title='"+performance+"'";
      console.log("Getting all performers in " + performance);
      databaseConnection.query(selectQuery, function(err, data){
        try {
          if(err){
            throw new Error(err)
          }
          data.forEach((performer, index) => {
            console.log((index + 1) + ". " + performer.name)
          });
        } catch (e) {
          console.log(e)
        } finally {
          databaseConnection.end();
        }
      });
    })
  })
}
