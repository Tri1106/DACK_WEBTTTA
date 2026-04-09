const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const env = require("./env");

const app = express();

/* ========================
   MIDDLEWARE
======================== */
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: env.FRONTEND_URL,
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/* ========================
   ROUTES
======================== */
// test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

const userRoutes = require("../routes/user.routes");
const authRoutes = require("../routes/auth.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

/* ========================
   EXPORT APP
======================== */
module.exports = app;
