const Pool = require("pg-pool");
const dotenv = require("dotenv");

dotenv.config();
let databaseConfig = { connectionString: process.env.URL };
let dbPool = new Pool(databaseConfig);


module.exports = dbPool;