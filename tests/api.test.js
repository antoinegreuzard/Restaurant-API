const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../server');
require('dotenv').config();

let server;
let db;

async function initializeDatabaseConnection() {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

async function closeDatabaseConnection() {
  if (db) {
    await db.end();
  }
}

beforeAll(async () => {
  await initializeDatabaseConnection();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  }
  await closeDatabaseConnection();
});

describe('GET /items', () => {
  it('responds with an array of items', async () => {
    const response = await request(app)
      .get('/items')
      .auth('admin', process.env.ADMIN_PASS);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
