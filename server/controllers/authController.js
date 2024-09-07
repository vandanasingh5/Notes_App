
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// User Signup
export const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const [existingUsers] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }


    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Insert the new user
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'User registered successfully!' });

    } else {
      res.status(500).json({ message: 'Failed to register user.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error.' });
  }
};



// User Login
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: false,
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      auth: true,

      message: 'Login successful',
      user: {

        username: user.username,

      },
    }

    );
  } catch (err) {
    res.status(500).json({ error: 'Database error during login' });
  }
};

// Logout (Clear cookie)
export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ auth: false, message: 'Logged out successfully' });
};
