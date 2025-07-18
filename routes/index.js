const express = require("express");
const Car = require("../models/cars");
const { model } = require("mongoose");

const router = express.Router();

// Home page
router.get("/", async (req, res) => {
  try {
    // Get featured cars (newest 3)
    const featuredCars = await Car.find().sort({ createdAt: -1 }).limit(3).populate("owner", "username");

    res.render("index", {
      title: "SuperCars - Home",
      featuredCars,
    });
  } catch (err) {
    res.status(500).render("error", { title: "Error", error: err });
  }
});

// About page
router.get("/about", (req, res) => {
  res.render("about", { title: "About SuperCars" });
});

module.exports = router