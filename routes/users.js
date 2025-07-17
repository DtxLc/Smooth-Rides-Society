const express = require("express");
const User = require("../models/User"); 
const Car = require("../models/Car"); 
const { isLoggedIn } = require("../middleware/auth");

const router = express.Router();

// Show user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).render("404", { title: "User  Not Found" });
    }

    // Get user's cars
    const cars = await Car.find({ owner: user._id }).sort({ createdAt: -1 });

    res.render("users/profile", {
      title: `${user.username}'s Profile`,
      profile:user , user,
      cars,
      isOwnProfile: req.session.user && req.session.user._id === user._id.toString(),
    });
  } catch (err) {
    res.status(500).render("error", { title: "Error", error: err });
  }
});

// Show edit profile form
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  try {
    // Ensure user can only edit their own profile
    if (req.params.id !== req.session.user._id) {
      return res.status(403).render("error", {
        title: "Unauthorized",
        error: { message: "You can only edit your own profile" },
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).render("404", { title: "User  Not Found" });
    }

    res.render("users/edit", {
      title: "Edit Profile",
      user,
    });
  } catch (err) {
    res.status(500).render("error", { title: "Error", error: err });
  }
});

// Update profile
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    // Ensure user can only edit their own profile
    if (req.params.id !== req.session.user._id) {
      return res.status(403).render("error", {
        title: "Unauthorized",
        error: { message: "You can only edit your own profile" },
      });
    }

    const { email, bio, profilePicture } = req.body;

    const updatedUser  = await User.findByIdAndUpdate(req.params.id, { email, bio, profilePicture }, { new: true });

    // Update session data
    req.session.user = {
      ...req.session.user,
      email: updatedUser .email,
      profilePicture: updatedUser .profilePicture,
    };

    res.redirect(`/users/${updatedUser ._id}`);
  } catch (err) {
    res.render("users/edit", {
      title: "Edit Profile",
      error: "Error updating profile",
      user: { ...req.body, _id: req.params.id },
    });
  }
});