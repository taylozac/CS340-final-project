

CREATE TABLE End_User(
	`username` VARCHAR(64) NOT NULL UNIQUE,
	`password` VARCHAR(256) NOT NULL,
	`admin` BOOLEAN NOT NULL DEFAULT 0,
	PRIMARY KEY (username)
);

CREATE TABLE Supplier(
	`s_id` INT(11) AUTO_INCREMENT,
	`name` VARCHAR(64) NOT NULL UNIQUE,
	`description` TEXT NOT NULL,
	`username` VARCHAR(64) NOT NULL,
	PRIMARY KEY (s_id),
	FOREIGN KEY (username) REFERENCES End_User(username)
);

CREATE TABLE Recipe(
	`r_id` INT(11) AUTO_INCREMENT,
	`title` VARCHAR(64) NOT NULL,
	`directions` TEXT NOT NULL,
	`username` VARCHAR(64) NOT NULL,
	PRIMARY KEY (r_id),
	FOREIGN KEY (username) REFERENCES End_User(username)
);

CREATE TABLE Ingredient(
	`i_id` INT(11) AUTO_INCREMENT,
	`name` VARCHAR(64) NOT NULL,
	`description` TEXT NOT NULL,
	`organic` BOOLEAN NOT NULL DEFAULT 0,
	`shelf_life` DATE,
	PRIMARY KEY (i_id)
);

CREATE TABLE Tool(
	`t_id` INT(11) AUTO_INCREMENT,
	`name` VARCHAR(64) NOT NULL,
	`description` TEXT NOT NULL,
	PRIMARY KEY (t_id)
);



CREATE TABLE saves(
	`username` VARCHAR(64) NOT NULL,
	`r_id` INT(11) NOT NULL,
	PRIMARY KEY (username, r_id),
	FOREIGN KEY (username) REFERENCES End_User(username),
	FOREIGN KEY (r_id) REFERENCES Recipe(r_id),
	CONSTRAINT saves_once UNIQUE (username, r_id)
);

CREATE TABLE consumes(
	`r_id` INT(11) NOT NULL,
	`i_id` INT(11) NOT NULL,
	`amount` INT(11) NOT NULL,
	PRIMARY KEY (r_id, i_id),
	FOREIGN KEY (r_id) REFERENCES Recipe(r_id),
	FOREIGN KEY (i_id) REFERENCES Ingredient(i_id),
	CONSTRAINT consumes_once UNIQUE (r_id, i_id)
);

CREATE TABLE uses(
	`r_id` INT(11) NOT NULL,
	`t_id` INT(11) NOT NULL,
	PRIMARY KEY (r_id, t_id),
	FOREIGN KEY (r_id) REFERENCES Recipe(r_id),
	FOREIGN KEY (t_id) REFERENCES Tool(t_id),
	CONSTRAINT uses_once UNIQUE (r_id, t_id)
);

CREATE TABLE manufactures(
	`s_id` INT(11) NOT NULL,
	`t_id` INT(11) NOT NULL,
	PRIMARY KEY (s_id, t_id),
	FOREIGN KEY (s_id) REFERENCES Supplier(s_id),
	FOREIGN KEY (t_id) REFERENCES Tool(t_id),
	CONSTRAINT manufactures_once UNIQUE (s_id, t_id)
);

CREATE TABLE stocks(
	`s_id` INT(11) NOT NULL,
	`i_id` INT(11) NOT NULL,
	`amount` INT(11) NOT NULL,
	PRIMARY KEY (s_id, i_id),
	FOREIGN KEY (s_id) REFERENCES Supplier(s_id),
	FOREIGN KEY (i_id) REFERENCES Ingredient(i_id),
	CONSTRAINT stocks_once UNIQUE (s_id, i_id)
);


INSERT INTO End_User(username, password, admin)
VALUES ('admin', 'admin_password', 1);

INSERT INTO End_User(username, password, admin)
VALUES ('John123', 'password', 0);

INSERT INTO End_User(username, password, admin)
VALUES ('Mike123', 'password', 0);

INSERT INTO End_User(username, password, admin)
VALUES ('bob123', 'password', 0);

INSERT INTO End_User(username, password, admin)
VALUES ('Jannett123', 'password', 0);

INSERT INTO End_User(username, password, admin)
VALUES ('Sarah123', 'password', 0);

INSERT INTO End_User(username, password, admin)
VALUES ('liam123', 'password', 0);

INSERT INTO End_User(username, password, admin)
VALUES ('frederick123', 'password', 0);

INSERT INTO End_User(username, password, admin)
VALUES ('sydney123', 'password', 0);

INSERT INTO End_User(username, password, admin)
VALUES ('roger123', 'password', 0);

INSERT INTO End_User(username, password, admin)
VALUES ('Alexa123', 'password', 0);



INSERT INTO Supplier(name, description, username)
VALUES ('Roger Family Farms', 'Supplies fruits and veggies from farm', 'roger123');

INSERT INTO Supplier(name, description, username)
VALUES ('Winco Foods', 'Supplies all your grocery needs', 'frederick123');

INSERT INTO Supplier(name, description, username)
VALUES ('Grocery Outlet', 'Bargain Market', 'Sarah123');

INSERT INTO Supplier(name, description, username)
VALUES ('Safeway', 'Supplies fruits and veggies from farm', 'sydney123');

INSERT INTO Supplier(name, description, username)
VALUES ('Costco', 'We keep the costs low', 'Alexa123');




INSERT INTO Recipe(title, directions, username)
VALUES ('Tacos', '', 'Jannett123');

INSERT INTO Recipe(title, directions, username)
VALUES ('Cheese Burger', '', 'Sarah123');

INSERT INTO Recipe(title, directions, username)
VALUES ('Barbeque Chicken', '', 'bob123');

INSERT INTO Recipe(title, directions, username)
VALUES ('Spahgetti and Meatballs', '', 'liam123');

INSERT INTO Recipe(title, directions, username)
VALUES ('Chocolate Cake', '', 'Alexa123');



INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('Ground Beef', '', 0, '2020-06-30');

INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('Lettuce', '', 1, '2020-05-30');

INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('Taco Shells', '', 0, '2021-05-10');

INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('Chicken', '', 0, '2020-06-30');

INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('Spahgetti Noodles', '', 0, '2020-06-30');

INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('Pasta Sauce', 'Red sauce for pasta', 0, '2022-06-30');

INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('Salsa', '', 1, '2022-09-30');

INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('Hamburger Buns', '', 0, '2020-07-30');

INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('Chedder Cheese', '', 0, '2020-08-10');

INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('eggs', '', 1, '2020-05-30');

INSERT INTO Ingredient(name, description, organic, shelf_life)
VALUES ('Cake Mix', '', 0, '2022-06-30');




INSERT INTO Tool(name, description)
VALUES ('Bowl', 'large bowl for mixing stuff');

INSERT INTO Tool(name, description)
VALUES ('Grill', 'For Grillin');

INSERT INTO Tool(name, description)
VALUES ('Mixer', 'Mix stuff');

INSERT INTO Tool(name, description)
VALUES ('Pot', 'Pot for cooking');

INSERT INTO Tool(name, description)
VALUES ('Skillet', 'Skillet for cooking');


INSERT INTO saves(username, r_id)
VALUES(
    'roger123', 
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Tacos')
);

INSERT INTO saves(username, r_id)
VALUES(
    'Sarah123', 
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Cheese Burger')
);

INSERT INTO saves(username, r_id)
VALUES(
    'Jannett123', 
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Chocolate Cake')
);

INSERT INTO saves(username, r_id)
VALUES(
    'Alexa123', 
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Barbeque Chicken')
);

INSERT INTO saves(username, r_id)
VALUES(
    'liam123', 
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Spahgetti and Meatballs')
);


INSERT INTO consumes(r_id, i_id, amount)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Tacos'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Ground Beef'),
    1
);

INSERT INTO consumes(r_id, i_id, amount)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Tacos'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Lettuce'),
    3
);

INSERT INTO consumes(r_id, i_id, amount)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Tacos'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Salsa'),
    2
);

INSERT INTO consumes(r_id, i_id, amount)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Cheese Burger'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Ground Beef'),
    1
);

INSERT INTO consumes(r_id, i_id, amount)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Cheese Burger'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Chedder Cheese'),
    1
);

INSERT INTO consumes(r_id, i_id, amount)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Cheese Burger'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Hamburger Buns'),
    2
);

INSERT INTO consumes(r_id, i_id, amount)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Spahgetti and Meatballs'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Spahgetti Noodles'),
    1
);

INSERT INTO consumes(r_id, i_id, amount)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Spahgetti and Meatballs'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Pasta Sauce'),
    1
);

INSERT INTO consumes(r_id, i_id, amount)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Chocolate Cake'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'eggs'),
    2
);

INSERT INTO consumes(r_id, i_id, amount)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Chocolate Cake'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Cake Mix'),
    1
);


INSERT INTO uses(r_id, t_id)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Chocolate Cake'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = 'Bowl')
);

INSERT INTO uses(r_id, t_id)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Chocolate Cake'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = 'Mixer')
);

INSERT INTO uses(r_id, t_id)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Cheese Burger'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = 'Grill')
);

INSERT INTO uses(r_id, t_id)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Spahgetti and Meatballs'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = 'Pot')
);

INSERT INTO uses(r_id, t_id)
VALUES (
    (SELECT r_id
    FROM Recipe r
    WHERE r.title = 'Barbeque Chicken'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = 'Skillet')
);


INSERT INTO manufactures(s_id, t_id)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Grocery Outlet'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = "Pot")
);

INSERT INTO manufactures(s_id, t_id)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Grocery Outlet'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = 'Skillet')
);

INSERT INTO manufactures(s_id, t_id)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Costco'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = 'Grill')
);

INSERT INTO manufactures(s_id, t_id)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Costco'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = 'Mixer')
);

INSERT INTO manufactures(s_id, t_id)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Safeway'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = 'Bowl')
);

INSERT INTO manufactures(s_id, t_id)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Winco Foods'),
    (SELECT t_id
    FROM Tool t
    WHERE t.name = 'Bowl')
);


INSERT INTO stocks(s_id, i_id, amount)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Winco Foods'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Lettuce'),
    100
);

INSERT INTO stocks(s_id, i_id, amount)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Safeway'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Taco Shells'),
    100
);

INSERT INTO stocks(s_id, i_id, amount)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Roger Family Farms'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'eggs'),
    50
);

INSERT INTO stocks(s_id, i_id, amount)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Costco'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Chicken'),
    100
);

INSERT INTO stocks(s_id, i_id, amount)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Costco'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Hamburger Buns'),
    100
);

INSERT INTO stocks(s_id, i_id, amount)
VALUES (
    (SELECT s_id
    FROM Supplier s
    WHERE s.name = 'Winco Foods'),
    (SELECT i_id
    FROM Ingredient i
    WHERE i.name = 'Cake Mix'),
    10
);
