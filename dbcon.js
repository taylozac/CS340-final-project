var mysql = require("mysql");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "MichaelHathaway.local",
  user: "root",
  password: "&Adm1nH@thawamMySQL",
  database: "CS340_Project",
});

module.exports.pool = pool;
