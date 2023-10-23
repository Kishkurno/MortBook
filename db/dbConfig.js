import dotenv from "dotenv";
const sql = require("mssql");
dotenv.config();

const config = {
  user: "Maria",
  password: "12345",
  server: "DESKTOP-AVSQC9",
  database: "MortBook",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
  port: 1433,
};

export async function connect() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error("Error connecting to database", err);
  }
}
