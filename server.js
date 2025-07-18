const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const MongoStore = require("connect-mongo");
const path = require("path");
const express = require("express");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up __dirname equivalent for ES modules
//const __dirname = path.resolve(); //current directory

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.log("App will continue without database functionality");
    });
} else {
  console.log("No MongoDB URI provided, running without database");
}

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "super-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};

// Only use MongoDB store if URI is provided
if (process.env.MONGODB_URI) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60, // 14 days
  });
}

app.use(session(sessionConfig));

// Make user data available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Import routes
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars");
const userRoutes = require("./routes/users");

// Routes
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/cars", carRoutes);
app.use("/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", {
    title: "Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
