const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: { type: String, required: true, trim: true, },
    model: { type: String, required: true, trim: true, },
    year: { type: Number, required: true, min: 1885, max: new Date().getFullYear() + 1, },
    color: {type: String, required: true, trim: true, }, 
    horsePower: { type: Number, required: true, min: 0, },
    topSpeed: { type: Number, required: true, min: 0 },
    zeroToSixty: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0, },
    description: { type: String, required: true, },
    image: { type: String, required: true, },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// Virtual for formatted price
carSchema.virtual("formattedPrice").get(function () {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(this.price)
})

const Car = mongoose.model('cars', carSchema);
module.exports = Car;
