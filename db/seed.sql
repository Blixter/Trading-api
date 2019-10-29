INSERT INTO users (firstname, lastname, email, password)
VALUES ("Test", "Testsson", "test@test.test", "testtest");

INSERT INTO objects (name, price)
VALUES ("Gold", 457.69);

INSERT INTO objects (name, price)
VALUES ("Silver", 5.43);

INSERT INTO depots (user_email, balance)
VALUES ("test@test.test", 1000);

INSERT INTO objects_in_depot(object_rowid, depot_email, amount)
VALUES (1, "test@test.test", 10);

INSERT INTO objects_in_depot(object_rowid, depot_email, amount)
VALUES (2, "test@test.test", 1000);
