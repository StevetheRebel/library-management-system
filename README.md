## Schema Decisions

`Book` references `Genre` through the `genreId` foreign key. Many books
share one genre, so the database stores the genre name once. Renaming
a genre requires updating one row. The foreign key ensures every book
points to an existing genre.