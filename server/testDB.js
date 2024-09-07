import db from './db/db.js';

export const testConnection =  async function () {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    console.log('The solution is: ', rows[0].solution);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}


