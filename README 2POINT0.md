# Smooth Rides Society - Sports Car Collection App

![Smooth Rides Society Logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTS-OLFaidDZ_X-oJT9QiXWjxG5uquH2ySSg&s")

## Description

Smooth Rides Society is a full-stack web application that allows users to create, view, update, and delete sports cars in their collection. Users can create accounts, add their favorite sports cars with detailed specifications, browse cars added by other users, and manage their profile.

The application is built using Node.js, Express, MongoDB, and EJS templates, following the MVC architecture pattern.

## Features

- User authentication (register, login, logout)
- Full CRUD functionality for sports cars
- User profiles with car collections
- Responsive design for all devices
- RESTful API routes
- Authorization (only creators can edit/delete their cars)
- Form validation
- Error handling

## Screenshots

![Home Page]("http://localhost:3000/")
![Car Details]("http://localhost:3000/cars")
![User Profile]("")

## Getting Started

### Live Demo

Check out the live demo: [Smooth Rides Society App]()

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/DtxLc/Smooth-Rides-Society.git
   cd Smooth Rides Society-app
   

2. Install dependencies:
   ```
   npm install
   

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/Smooth Rides Society
   SESSION_SECRET=your_session_secret_here
   NODE_ENV=development
   ```

4. Seed the database (optional):
   ```
   node scripts/seed.js
   ```

5. Start the application:
   ```
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Planning Materials

- [Trello](https://trello.com/b/gMWa4V2W/smooth-rides-society)
- [Wireframes]()
- [ERD Diagram]()

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Frontend**: EJS, CSS, JavaScript
- **Authentication**: Express-session, bcrypt
- **Other**: Method-override, dotenv, connect-mongo

## Next Steps

- Add car reviews and ratings
- Implement a messaging system between users
- Add a search and filter functionality
- Create an admin dashboard
- Add car comparison feature
- Implement social media sharing

## Author

Bryan Vizueta - [GitHub](https://github.com/DtxLc) 
