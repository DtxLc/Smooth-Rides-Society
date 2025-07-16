const express = require('express');
const Car = require('../models/cars');
const router = express.Router();
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// Index Route
router.get('/', async (req, res) => {
    const cars = await Car.find({}).populate('owner');
    res.render('cars/index', { cars });
});

// New Route
router.get('/new', isAuthenticated, (req, res) => {
    res.render('cars/new');
});

// Create Route
router.post('/', isAuthenticated, async (req, res) => {
    const car = new Car({ ...req.body, owner: req.session.userId });
    await car.save();
    res.redirect('/cars');
});

// Show Route
router.get('/:id', async (req, res) => {
    const car = await Car.findById(req.params.id).populate('owner');
    res.render('cars/show', { car });
});

// Edit Route
router.get('/:id/edit', isAuthenticated, async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (car.owner.equals(req.session.userId)) {
        res.render('cars/edit', { car });
    } else {
        res.redirect('/cars');
    }
});

// Update Route
router.put('/:id', isAuthenticated, async (req, res) => {
    await Car.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/cars/${req.params.id}`);
});

// Delete Route
router.delete('/:id', isAuthenticated, async (req, res) => {
    await Car.findByIdAndDelete(req.params.id);
    res.redirect('/cars');
});

module.exports = router;
