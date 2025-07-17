const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const user = require("../models/user.js");
const cars = require("../models/cars.js");
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample data
const users = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Car enthusiast and collector. I love sports cars and attending car shows.",
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
    bio: "Racing driver and automotive journalist. I review the latest sports cars.",
  },
  {
    username: "mike_johnson",
    email: "mike@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
    bio: "Mechanical engineer and car designer. I appreciate the technical aspects of sports cars.",
  },
]

const cars = [
  {
    make: "Ferrari",
    model: "488 GTB",
    year: 2020,
    color: "Rosso Corsa",
    price: 280000,
    horsepower: 661,
    topSpeed: 205,
    zeroToSixty: 3.0,
    description:
      "The Ferrari 488 GTB is a mid-engine sports car produced by the Italian automobile manufacturer Ferrari. The car replaced the 458, being the first mid-engine Ferrari to use a turbocharged V8 since the F40.",
    imageUrl:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
  },
  {
    make: "Lamborghini",
    model: "Huracán",
    year: 2021,
    color: "Verde Mantis",
    price: 260000,
    horsepower: 630,
    topSpeed: 202,
    zeroToSixty: 2.9,
    description:
      "The Lamborghini Huracán is a sports car built by Italian automotive manufacturer Lamborghini replacing the previous V10 offering, the Gallardo. The Huracán was revealed online in December 2013, making its worldwide debut at the 2014 Geneva Auto Show.",
    imageUrl:
      "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
  },
  {
    make: "Porsche",
    model: "911 GT3 RS",
    year: 2022,
    color: "Racing Yellow",
    price: 215000,
    horsepower: 520,
    topSpeed: 193,
    zeroToSixty: 3.2,
    description:
      "The Porsche 911 GT3 RS is a high-performance homologation model of the Porsche 911 sports car. It is a road-legal sports car that is designed to excel on the race track.",
    imageUrl:
      "https://images.unsplash.com/photo-1611651338412-8403fa6e3599?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
  },
  {
    make: "McLaren",
    model: "720S",
    year: 2021,
    color: "Papaya Spark",
    price: 299000,
    horsepower: 710,
    topSpeed: 212,
    zeroToSixty: 2.8,
    description:
      "The McLaren 720S is a sports car designed and manufactured by British automobile manufacturer McLaren Automotive. It is the second all-new car in the McLaren Super Series, replacing the 650S beginning in May 2017.",
    imageUrl:
      "https://images.unsplash.com/photo-1621135802920-133df287f89c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
  },
  {
    make: "Aston Martin",
    model: "Vantage",
    year: 2022,
    color: "Magnetic Silver",
    price: 150000,
    horsepower: 503,
    topSpeed: 195,
    zeroToSixty: 3.5,
    description:
      "The Aston Martin Vantage is a two-seater sports car manufactured by British luxury car manufacturer Aston Martin as a successor to the previous Vantage. It was introduced in 2018 as the successor to the previous Vantage which had been in production for 12 years.",
    imageUrl:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
  },
  {
    make: "Bugatti",
    model: "Chiron",
    year: 2021,
    color: "French Racing Blue",
    price: 3000000,
    horsepower: 1500,
    topSpeed: 261,
    zeroToSixty: 2.5,
    description:
      "The Bugatti Chiron is a mid-engine two-seater sports car developed and manufactured by Bugatti Automobiles S.A.S. as the successor to the Bugatti Veyron. The Chiron was first shown at the Geneva Motor Show on March 1, 2016.",
    imageUrl:
      "https://images.unsplash.com/photo-1566024146175-d71a4a5d3c75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
  },
]

// Seed database
async function seedDatabase() {
  try {
    // Clear existing data
    await user.deleteMany({})
    await car.deleteMany({})

    console.log("Existing data cleared")

// Create users
const createdUsers = []
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = new user({
      ...userData,
      password: hashedPassword,
    })
    const savedUser = await user.save()
    createdUsers.push(savedUser)
    console.log(`Created user: ${savedUser.username}`)
    }

// Create cars and assign to users
for (let i = 0; i < cars.length; i++) {
  const userIndex = i % createdUsers.length
  const car = new Car({
    ...cars[i],
    owner: createdUsers[userIndex]._id,
  })
  const savedCar = await car.save()
  console.log(`Created car: ${savedCar.year} ${savedCar.make} ${savedCar.model}`)
  }

  console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

seedDatabase()