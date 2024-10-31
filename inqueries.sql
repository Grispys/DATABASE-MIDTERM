
Here are the sample insertion queries:


 CUSTOMERS: inserts 5 customers
   INSERT INTO Customers(fname, lname, phonenum, email)
    VALUES ('matthew', 'verge', '888314923', 'matthew@yahoo.ca'), ('bratthew', 'birch', '5738564976', 'oaktrees@outlook.com'),
    ('adam', 'apple', '333022931', 'adamsgotapples@gmail.com'), ('Yah', 'Hooey', '1234567891', 'ownerofyahoo@yahoo.ca'),
    ('edward', 'gadd', '4443332226', 'oldinventor3@gmail.ca')


 MOVIES: inserts 5 movies
    INSERT INTO movies(title, year, genre, director)
    VALUES ('i am a human i swear', 2024, 'romance', 'guy human'), ('slave to my raccoon child', 2011, 'comedy', 'Xi Hui'), ('praline pecans', 2022, 'horror', 'accordian jones'  ),
           ('battlefield', 2024, 'action', 'michael bay'), ('Yep', 2022, 'horror', 'jordan peele')

 RENTALS: inserts 10 rentals
    INSERT INTO rentals(renter, movie, taken_date, due_date)
    VALUES (1, 1, '2024-10-10', '2024-11-24'),
           (1, 2, '2024-02-19', '2024-02-19'),
           (2, 3, '2024-10-28', '2024-11-19'),
           (2, 4, '2024-09-19', '2024-10-02'),
           (3, 5, '2024-03-26', '2024-03-30'),
           (3, 1, '2024-08-29', '2024-08-29'),
           (4, 2, '2024-02-24', '2024-02-29'),
           (4, 3, '2024-10-14', '2024-12-28'),
           (5, 4, '2024-04-20', '2024-05-10'),
           (5, 5, '2024-04-29', '2024-05-05')




QUESTIONS:
-- 1. FIND ALL MOVIES RENTED BY CUSTOMER using email:
   SELECT customer.email, rental.movie, rental.taken_date, rental.due_date
   FROM rentals rental
   JOIN customers customer ON rental.renter = customer.id
   WHERE customer.email = 'matthew@yahoo.ca';
-- 2. Given a movie title, list all customers who have rented the movie:
 SELECT customer.id, customer.fname, customer.lname
 FROM rentals rental
 JOIN customers customer ON rental.renter = customer.id
 JOIN movies movie ON rental.movie = movie.id
 WHERE movie.title = 'praline pecans';
-- 3. Get the rental history for a specific movie title:
 SELECT rental.renter, rental.taken_date, rental.due_date
 FROM rentals rental
 JOIN movies movie ON rental.movie = movie.id
 WHERE movie.title = 'i am a human i swear';

-- 4. for movie director, find customer, title movie, date of rental, from each time that movie was rented
 SELECT rental.renter, rental.movie, movie.title, rental.taken_date
 FROM rentals rental
 JOIN movies movie ON rental.movie = movie.id
 WHERE movie.director = 'guy human';

-- 5. list all currently rented movies( dates havent been met)
 SELECT renter, movie, taken_date, due_date
 FROM rentals
 WHERE due_date >= CURRENT_DATE;
    