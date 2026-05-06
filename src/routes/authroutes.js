import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const router = express.Router();

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔒 basic validation
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    // optional default todo
    await prisma.todo.create({
      data: {
        task: "Add your first task 🚀",
        userid: user.id
      }
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);

    // 🔥 Prisma duplicate username
    if (err.code === "P2002") {
      return res.status(400).json({
        error: "User already exists. Please login."
      });
    }

    res.status(500).json({ error: "Registration failed" });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔒 validation
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;