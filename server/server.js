const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const api = express.Router();

const jsonParser = bodyParser.json();

api.post("/auth/signup", jsonParser, async (req, res) => {
    const { username, password, role } = req.body;
    if (
        typeof username !== "string" ||
        !/^[a-zA-Z0-9\-_]{3,30}$/.test(username)
    ) {
        res.status(400).json({ error: "Invalid username" });
        return;
    }
    if (typeof password !== "string" || !(10 <= password.length)) {
        res.status(400).json({ error: "Invalid password" });
        return;
    }
    if (role !== "student" && role !== "teacher") {
        res.status(400).json({ error: "Invalid role" });
        return;
    }
    res.send(`hello ${username}`);
});

const app = express();
app.use("/api/v1", api);
app.listen(8080);
console.log("running server at localhost:8080");
