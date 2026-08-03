import 'dotenv/config';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Ruta de la BD configurable (los tests usan una BD temporal)
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'autoescuela.db');

let db: Database.Database | null = null;

export function getDB(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    inicializarEsquema(db);
  }
  return db;
}

function inicializarEsquema(db: Database.Database): void {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
}
