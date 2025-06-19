import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";


const router = express.Router();

//registe user 
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const userexists = await User.findOne({ email });
        if (userexists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
           console.error("Error in /register route:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//login user
/*router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }


        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});*/

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error("Error in /login route:", error);
        res.status(500).json({ message: "Server error" });
    }
});


//me

router.get("/me", protect, async (req, res) => {
  res.status(200).json(req.user);
});

//generate jwt token 
/**/ 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};


export default router;