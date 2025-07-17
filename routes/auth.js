const express = require("express");
const User = require("../models/User"); 
const { isLoggedIn, isNotLoggedIn } = require("../middleware/auth"); 

const router = express.Router();

// Login form
router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("auth/login", { title: "Login" });
});

// Login process
router.post("/login", isNotLoggedIn, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        error: "Invalid username or password",
        username,
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("auth/login", {
        title: "Login",
        error: "Invalid username or password",
        username,
      });
    }

    // Set user in session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    };

    // Redirect to intended page or default
    const redirectUrl = req.session.returnTo || "/cars";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  } catch (err) {
    res.render("auth/login", {
      title: "Login",
      error: "An error occurred. Please try again.",
      username: req.body.username,
    });
  }
});

// Register form
router.get("/register", isNotLoggedIn, (req, res) => {
  res.render("auth/register", { title: "Register" });
});

// Register process
router.post("/register", isNotLoggedIn, async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate passwords match
    if (password !== confirmPassword) {
      return res.render("auth/register", {
        title: "Register",
        error: "Passwords do not match",
        username,
        email,
      });
    }

    // Check if user already exists
    const existingUser  = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser ) {
      return res.render("auth/register", {
        title: "Register",
        error: "Username or email already in use",
        username,
        email,
      });
    }

    // Create new user
    const newUser  = new User({ username, email, password });
    await newUser .save();

    // Set user in session
    req.session.user = {
      _id: newUser ._id,
      username: newUser .username,
      email: newUser .email,
      profilePicture: newUser .profilePicture,
    };

    res.redirect("/cars");
  } catch (err) {
    res.render("auth/register", {
      title: "Register",
      error: "An error occurred. Please try again.",
      username: req.body.username,
      email: req.body.email,
    });
  }
});

// Logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.redirect("/");
  });
});
