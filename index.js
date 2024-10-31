const { Pool } = require('pg');

// Here are the sample insertion queries:
// CUSTOMERS:
//    INSERT INTO Customers(fname, lname, phonenum, email)
//    VALUES ('matthew', 'verge', '888314923', 'matthew@yahoo.ca'), ('bratthew', 'birch', '5738564976', 'oaktrees@outlook.com'),
//    ('adam', 'apple', '333022931', 'adamsgotapples@gmail.com'), ('Yah', 'Hooey', '1234567891', 'ownerofyahoo@yahoo.ca'),
//    ('edward', 'gadd', '4443332226', 'oldinventor3@gmail.ca')
//
// RENTALS: 
//    INSERT INTO rentals(renter, movie, taken_date, due_date)
//    VALUES (1, 1, '2024-10-10', '2024-10-24'),
//           (1, 2, '2024-02-19', '2024-02-19'),
//           (2, 3, '2024-10-28', '2024-11-11'),
//           (2, 4, '2024-09-19', '2024-10-02'),
//           (3, 5, '2024-03-26', '2024-03-30'),
//           (3, 1, '2024-08-29', '2024-08-29'),
//           (4, 2, '2024-02-24', '2024-02-29'),
//           (4, 3, '2024-10-14', '2024-10-28'),
//           (5, 4, '2024-04-20', '2024-05-10'),
//           (5, 5, '2024-04-29', '2024-05-05')
//
// MOVIES:
//    INSERT INTO movies(title, year, genre, director)
//    VALUES ("i am a human i swear" 2024 "romance" "guy human"), ("slave to my raccoon child" 2011 "comedy" "Xi Hui"), ( "praline pecans" 2022 "horror" "accordian jones"  ),
//           ("battlefield" 2024 "action" "michael bay"), ("Yep" 2022 "horror" "jordan peele")
//    


// FIND ALL MOVIES RENTED BY CUSTOMER using email:
//    SELECT customer.email, rental.movie, rental.taken_date, rental.due_date
//    FROM rentals rental
//    JOIN customers customer ON rental.renter = customer.id
//    WHERE customer.email = 'matthew@yahoo.ca';

// Given a movie title, list all customers who have rented the movie:
//  SELECT customer.id, customer.fname, customer.lname
//  FROM rentals rental
//  JOIN customers customer ON rental.renter = customer.id
//  JOIN movies movie ON rental.movie = movie.id
//  WHERE movie.title = 'praline pecans';

// Get the rental history for a specific movie title:

// for movie director, find customer, title movie, date of rental, from each time that movie was rented

// list all currently rented movies( dates havent been met)


// explain how tables meed 3nf

// all the cli stuff is done





// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', //This _should_ be your username, as it's the default one Postgres uses
  host: 'localhost',
  database: 'DBMIDTERM', //This should be changed to reflect your actual database
  password: 'persona', //This should be changed to reflect the password you used when setting up Postgres
  port: 5432,
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  // TODO: Add code to create Movies, Customers, and Rentals tables
  let query = `CREATE TABLE IF NOT EXISTS Movies (id SERIAL PRIMARY KEY, title VARCHAR(25) NOT NULL, year VARCHAR(4) NOT NULL, genre VARCHAR(15) NOT NULL, director VARCHAR(25) NOT NULL);
               CREATE TABLE IF NOT EXISTS Customers (id SERIAL PRIMARY KEY, email VARCHAR(25) NOT NULL, fName VARCHAR(15) NOT NULL, lName VARCHAR(15) NOT NULL, phonenum VARCHAR(10) NOT NULL);
               CREATE TABLE IF NOT EXISTS Rentals (id SERIAL PRIMARY KEY, renter INT REFERENCES Customers(id) ON DELETE CASCADE, movie INT REFERENCES Movies(id) ON DELETE CASCADE, taken_date DATE NOT NULL, due_date DATE NOT NULL); 
  ` //ON DELETE CASCADE automatically removes the rental history if a movie or customer is deleted neato
  try {
    await pool.query(query);
    console.log("Table's created successfully.");
  } catch (error) {
    console.error("Error creating tables", error);
  }
};

/**
 * Inserts a new movie into the Movies table.
 * 
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  let query = `INSERT INTO Movies(title, year, genre, director) VALUES ('${title}', ${year}, '${genre}', '${director}')`
  try {
    await pool.query(query)
    console.log("Successfully added movie to the table")
  } catch (error) {
    console.error("Error adding movie", error);
  }
};

/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  let query = `SELECT * FROM Movies`;

  try {
    let movies = await pool.query(query)
    console.log("Movies: ")
    movies.rows.forEach((row) => {
      console.log(row.id, "'" + row.title + "'", row.year, row.director)
    })
  } catch (error) {
    console.error("Error getting the movies: ", error);
  }
};

/**
 * Updates a customer's email address.
 * 
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  let query = `UPDATE customers SET email = '${newEmail}' WHERE id = ${customerId}`

  try {
    await pool.query(query)
    console.log("Customer email is now:" + newEmail);
  } catch (error){
    console.log("Error updating customers email: ", error);
  }
};

/**
 * Removes a customer from the database along with their rental history.
 * 
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  let query = `DELETE FROM Customers WHERE id = ${customerId}`
  try {
    await pool.query(query)
    console.log("Customer and their rental history has been deleted.");
  } catch (error){
    console.log("Error deleting customer info: ", error);
  }

  // BECAUSE the rentals tables has "ON DELETE CASCADE" for the customer variable, their rental history is automagically deleted i am g enius
};

/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log('Usage:');
  console.log('  insert <title> <year> <genre> <director> - Insert a movie');
  console.log('  show - Show all movies');
  console.log('  update <customer_id> <new_email> - Update a customer\'s email');
  console.log('  remove <customer_id> - Remove a customer from the database');
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2);
  switch (args[0]) {
    case 'insert':
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case 'show':
      await displayMovies();
      break;
    case 'update':
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case 'remove':
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }
};

runCLI();
