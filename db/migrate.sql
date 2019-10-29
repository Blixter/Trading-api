DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    firstname VARCHAR(40) NOT NULL,
    lastname VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE(email)
);

DROP TABLE IF EXISTS depots;
CREATE TABLE IF NOT EXISTS depots (
    user_email VARCHAR(255) NOT NULL,
    balance INTEGER DEFAULT 0 NOT NULL,
    UNIQUE(user_email)
);

DROP TABLE IF EXISTS objects;
CREATE TABLE IF NOT EXISTS objects (
    name VARCHAR(20) NOT NULL,
    price NUMERIC NOT NULL
);

DROP TABLE IF EXISTS objects_in_depot;
CREATE TABLE IF NOT EXISTS objects_in_depot (
    object_rowid INTEGER,
    depot_email VARCHAR(255) NOT NULL,
    amount INTEGER
);
