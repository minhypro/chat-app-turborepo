import { Database } from "sqlite";
import { sqlite3 } from "sqlite3";

// Define the type for the database instance
declare type ChatDatabase = Database<sqlite3.Database, sqlite3.Statement>;
