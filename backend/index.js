import express from 'express';
import dotenv, { config } from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from '../backend/routes/auth.js';
import notesRoutes from '../backend/routes/notes.js';
import path from 'path';

dotenv.config();

const app=express();

const PORT = process.env.PORT || 3000;
app.use(cors()); 

app.use(cors({
  origin: "http://localhost:5173", // your frontend origin
  credentials: true,
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log('Incoming request body:', req.body);
  next();
});

app.use("/api/users",authRoutes);
app.use("/api/notes", notesRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


app.get('/', (req, res) => {
  res.send('Hello World! welcome to the backend server');
});

app.listen(PORT, () => {
  console.log(`Server is running on  : ${PORT}`);
});

// Connect to the database
connectDB();