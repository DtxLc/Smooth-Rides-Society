const express = require("express");
const Car = require("../models/Car"); 
const { isLoggedIn, isOwner } = require("../middleware/auth"); 

const router = express.Router();

// Index - Show all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 }).populate("owner", "username");

    res.render("cars/index", {
      title: "All Sports Cars",
      cars,
    });
  } catch (err) {
    res.status(500).render("error", { title: "Error", error: err });
  }
});

// New - Show form to create new car
router.get("/new", isLoggedIn, (req, res) => {
  res.render("cars/new", { title: "Add New Car" });
});

// Create - Add new car to DB
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const { make, model, year, color, price, horsepower, topSpeed, zeroToSixty, description, imageUrl } = req.body;

    const newCar = new Car({
      make,
      model,
      year: Number.parseInt(year),
      color,
      price: Number.parseFloat(price),
      horsepower: Number.parseInt(horsepower),
      topSpeed: topSpeed ? Number.parseFloat(topSpeed) : undefined,
      zeroToSixty: zeroToSixty ? Number.parseFloat(zeroToSixty) : undefined,
      description,
      imageUrl: imageUrl || undefined,
      owner: req.session.user._id,
    });

    await newCar.save();
    res.redirect(`/cars/${newCar._id}`);
  } catch (err) {
    res.render("cars/new", {
      title: "Add New Car",
      error: "Error creating car. Please check all fields.",
      car: req.body,
    });
  }
});

// Show - Show info about one specific car
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate("owner", "username profilePicture");

    if (!car) {
      return res.status(404).render("404", { title: "Car Not Found" });
    }

    res.render("cars/show", {
      title: `${car.year} ${car.make} ${car.model}`,
      car,
      isOwner: req.session.user && req.session.user._id === car.owner._id.toString(),
    });
  } catch (err) {
    res.status(500).render("error", { title: "Error", error: err });
  }
});

// Edit - Show form to edit car
router.get("/:id/edit", isLoggedIn, isOwner(Car), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    res.render("cars/edit", {
      title: `Edit ${car.year} ${car.make} ${car.model}`,
      car,
    });
  } catch (err) {
    res.status(500).render("error", { title: "Error", error: err });
  }
});

// Update - Update a car
router.put("/:id", isLoggedIn, isOwner(Car), async (req, res) => {
  try {
    const { make, model, year, color, price, horsepower, topSpeed, zeroToSixty, description, imageUrl } = req.body;

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        make,
        model,
        year: Number.parseInt(year),
        color,
        price: Number.parseFloat(price),
        horsepower: Number.parseInt(horsepower),
        topSpeed: topSpeed ? Number.parseFloat(topSpeed) : undefined,
        zeroToSixty: zeroToSixty ? Number.parseFloat(zeroToSixty) : undefined,
        description,
        imageUrl: imageUrl || undefined,
      },
      { new: true },
    );

    res.redirect(`/cars/${updatedCar._id}`);
  } catch (err) {
    res.render("cars/edit", {
      title: "Edit Car",
      error: "Error updating car. Please check all fields.",
      car: { ...req.body, _id: req.params.id },
    });
  }
});

// Delete - Delete a car
router.delete("/:id", isLoggedIn, isOwner(Car), async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.redirect("/cars");
  } catch (err) {
    res.status(500).render("error", { title: "Error", error: err });
  }
});