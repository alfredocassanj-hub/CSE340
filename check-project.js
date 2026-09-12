import "dotenv/config";
import fs from "fs";
import db from "./src/models/db.js";

const sql = fs.readFileSync("./src/setup.sql", "utf-8");

await db.query(sql);

console.log("Base de dados recriada com sucesso!");
process.exit(0);