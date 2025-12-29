const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3000/",
  "http://localhost:5173/",
  process.env.FRONTEND_URL,
].filter(Boolean);
//middleware
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      try {
        const host = new URL(origin).hostname;
        if (host.endsWith("netlify.app")) return callback(null, true);
      } catch (e) {}

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//connexion to DB
const connectDB = require("./config/connectDB");
const seedRoles = require("./config/seed/seedRoles");
const seedAdmin = require("./config/seed/seedAdmin");
connectDB().then(async () => {
  try {
    await seedRoles()
    await seedAdmin();
  } catch (error) {
    console.log("Erreur while seeding", error.message);
  }
});
// Routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/users.route"));
//feelbacks
app.use((req, res) => {
  res.json("api is running!!!");
});
// ---------------------------------Fin de page-------------------------------
const PORT = process.env.PORT || 4500;
app.listen(PORT, (err) => {
  err
    ? console.log(err)
    : console.log(`Server is running on http://localhost:${PORT}`);
});
