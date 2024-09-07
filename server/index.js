import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from "./routes/routes.js"; 
import db from './db/db.js'; // Import the MySQL pool


dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Change this to your client's origin
  credentials: true, 
}));

// Setup routes
routes(app);

// Test MySQL connection
(async () => {
  try {
    const connection = await db.getConnection(); // Use async/await to test the connection
    console.log('Database connected successfully!');
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process if there's a database connection issue
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
