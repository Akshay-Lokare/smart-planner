const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");

const AuthSchema = require("./db/Schemas");
const { generateSessionKey, hashSessionKey } = require('./helper/SessionUtils');
const { parseDuration } = require('./helper/timeUtils');


dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL, // Only allow requests from frontend URL
    credentials: true               // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.info("Connected to MongoDb"))
    .catch((err) => console.error(`Error connecting to MongoDb: ${err}`));

app.get('/', (req, res) => {
    res.json({ "msg": "Hi from server" })
});

app.post('/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            console.warn(`Missing email`);
            return res.status(400).json({ message: "Missing email" });
        }
        if (!password) {
            console.warn(`Missing password`);
            return res.status(400).json({ message: "Missing password" });
        }

        const exists = await AuthSchema.findOne({ email });

        if (exists) {
            console.warn(`User with email: ${email} already exists`);
            return res.status(409).json({ message: `User with email: ${email} already exists` });
        }

        // Hash the password using bcrypt (12 salt rounds)
        const hashedPassword = await bcrypt.hash(password, 12);

        await AuthSchema.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: `Registeration of ${email} is done successfully` });
        console.info(`Registeration of ${email} is done successfully`);

    } catch (error) {
        console.error(err);
        res.status(500).json({ message: `Registration failed for ${email}` });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthSchema.findOne({ email, isActive: true });

        if (!user) {
            console.error(`Invalid credentials for ${email}`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            console.log(`Credentials do not match for ${email}`);
            return res.status(401).json({ message: `Credentials do not match for ${email}` });
        }

        const sessionKey = generateSessionKey();
        user.session = {
            hash: hashSessionKey(sessionKey),
            expiresAt: new Date(Date.now() + parseDuration("PT05")),
            lastLoginAt: new Date(),
        }

        await user.save();

        // Send session key as HttpOnly cookie
        res.cookie("session", sessionKey, {
            httpOnly: true,                              // JS cannot access cookie
            secure: process.env.NODE_ENV === 'prod', // HTTPS only in prod
            sameSite: 'strict',                          // CSRF protection
            maxAge: parseDuration("PT05")                        // Cookie expiry (5 minutes)
        });

        res.json({ message: "Login successful" });

    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Login failed" });

    }
});

app.get("/auth/me", async (req, res) => {
    try {
        // read session cookie from request
        const sessionKey = req.cookies?.session;
        if (!sessionKey)
            return res.status(401).json({ message: "Unauthorized" });

        const sessionHash = hashSessionKey(sessionKey);

        // Find user with valid (non-expired) session
        const user = await AuthSchema.findOne({
            "session.hash": sessionHash,
            "session.expiresAt": { $gt: new Date() },
            isActive: true
        }).select("_id email");

        if (!user)
            return res.status(401).json({ message: "Session expired" });

        res.json({ user });
    } catch {
        res.status(401).json({ message: "Auth failed" });
    }
});

app.post("/auth/logout", async (req, res) => {
    try {
        const sessionKey = req.cookies?.session;

        // If session exists, invalidate it in DB
        if (sessionKey) {
            await AuthSchema.updateOne(
                { "session.hash": hashSessionKey(sessionKey) },
                { $set: { session: { hash: null, expiresAt: null } } }
            );
        }

        // remove session cookie from browser
        res.clearCookie("session");
        res.json({ message: "Logged out" });
    } catch {
        res.status(500).json({ message: "Logout failed" });
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Server listening on https://localhost:${process.env.PORT}`);
});