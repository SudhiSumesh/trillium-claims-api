import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  connectionLimit: 10,
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

export const pool = mysql.createPool(dbConfig);

// Function to get a connection from the pool
const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (err) {
    console.error("Error getting connection from pool:", err);
    throw err;
  }
};

// Function to execute a query
const executeQuery = async (query, params) => {
  let connection;
  try {
    connection = await getConnection();
    const [results] = await connection.execute(query, params);
    return results;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

export { getConnection, executeQuery };
