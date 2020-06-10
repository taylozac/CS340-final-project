-- inserting new End_Users into database

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


-- insert new suppliers into database
-- trigger to update user associated with a supplier to be admin needs to be added

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


-- insert new Recipes into the database


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


-- Insert new Ingrdients into the database

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


-- Insert new tools into the database


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
