// Application state
const state = {
    isAuthenticated: false,
    current:  null,
    cars: [],
    currentCar: null,
    users: [
        { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123' }
    ],
    nextUserId: 2,
    nextCarId: 1
};

// DOM Elements
const elements = {
    navAuthButtons: document.getElementById('auth-buttons'),
    navUserInfo: document.getElementById('user-info'),
    usernameDisplay: document.getElementById('username-display'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    registerBtn: document.getElementById('register-btn'),
    addCarBtn: document.getElementById('add-car-btn'),
    filterControls: document.getElementById('filter-controls'),
    filterMake: document.getElementById('filter-make'),
    filterYear: document.getElementById('filter-year'),
    carsContainer: document.getElementById('cars-container'),
    // Modals
    loginModal: document.getElementById('login-modal'),
    closeLoginModal: document.getElementById('close-login-modal'),
    loginForm: document.getElementById('login-form'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    registerModal: document.getElementById('register-modal'),
    closeRegisterModal: document.getElementById('close-register-modal'),
    registerForm: document.getElementById('register-form'),
    registerUsername: document.getElementById('register-username'),
    registerEmail: document.getElementById('register-email'),
    registerPassword: document.getElementById('register-password'),
    registerConfirmPassword: document.getElementById('register-confirm-password'),
    switchToLogin: document.getElementById('switch-to-login'),
    switchToRegister: document.getElementById('switch-to-register'),
    carModal: document.getElementById('car-modal'),
    carModalTitle: document.getElementById('car-modal-title'),
    closeCarModal: document.getElementById('close-car-modal'),
    cancelCarModal: document.getElementById('cancel-car-modal'),
    carForm: document.getElementById('car-form'),
    carId: document.getElementById('car-id'),
    carMake: document.getElementById('car-make'),
    carModel: document.getElementById('car-model'),
    carYear: document.getElementById('car-year'),
    carColor: document.getElementById('car-color'),
    carImage: document.getElementById('car-image'),
    carDescription: document.getElementById('car-description'),
    confirmModal: document.getElementById('confirm-modal'),
    confirmTitle: document.getElementById('confirm-title'),
    confirmMessage: document.getElementById('confirm-message'),
    confirmNo: document.getElementById('confirm-no'),
    confirmYes: document.getElementById('confirm-yes')
};

// Event Listeners
function setupEventListeners() {
    // Authentication
    elements.loginBtn.addEventListener('click', openLoginModal);
    elements.logoutBtn.addEventListener('click', logout);
    elements.registerBtn.addEventListener('click', openRegisterModal);
    elements.switchToLogin.addEventListener('click', () => {
        closeRegisterModal();
        openLoginModal();
    });
    elements.switchToRegister.addEventListener('click', () => {
        closeLoginModal();
        openRegisterModal();
    });
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.registerForm.addEventListener('submit', handleRegister);
    elements.closeLoginModal.addEventListener('click', closeLoginModal);
    elements.closeRegisterModal.addEventListener('click', closeRegisterModal);

    // Cars
    elements.addCarBtn.addEventListener('click', openAddCarModal);
    elements.carForm.addEventListener('submit', handleCarSubmit);
    elements.closeCarModal.addEventListener('click', closeCarModal);
    elements.cancelCarModal.addEventListener('click', closeCarModal);
    
    // Filters
    elements.filterMake.addEventListener('change', filterCars);
    elements.filterYear.addEventListener('change', filterCars);

    // Confirmation
    elements.confirmNo.addEventListener('click', closeConfirmModal);
}

// Modal Functions
function openLoginModal() {
    elements.loginModal.classList.remove('hidden');
}

function closeLoginModal() {
    elements.loginModal.classList.add('hidden');
    elements.loginForm.reset();
}

function openRegisterModal() {
    elements.registerModal.classList.remove('hidden');
}

function closeRegisterModal() {
    elements.registerModal.classList.add('hidden');
    elements.registerForm.reset();
}

function openCarModal(car = null) {
    if (car) {
        elements.carModalTitle.textContent = 'Edit Car';
        elements.carId.value = car.id;
        elements.carMake.value = car.make;
        elements.carModel.value = car.model;
        elements.carYear.value = car.year;
        elements.carColor.value = car.color;
        elements.carImage.value = car.image || '';
        elements.carDescription.value = car.description || '';
        state.currentCar = car;
    } else {
        elements.carModalTitle.textContent = 'Add New Car';
        elements.carForm.reset();
        elements.carId.value = '';
        state.currentCar = null;
    }
    elements.carModal.classList.remove('hidden');
}

function closeCarModal() {
    elements.carModal.classList.add('hidden');
    elements.carForm.reset();
    elements.carId.value = '';
    state.currentCar = null;
}

function openConfirmModal(title, message, callback) {
    elements.confirmTitle.textContent = title;
    elements.confirmMessage.textContent = message;
    elements.confirmModal.classList.remove('hidden');
    
    // Store the callback to execute when confirmed
    elements.confirmYes.onclick = function() {
        callback();
        closeConfirmModal();
    };
}

function closeConfirmModal() {
    elements.confirmModal.classList.add('hidden');
}

// Authentication Functions
function login(user) {
    state.isAuthenticated = true;
    state.currentUser  = user;
    updateUI();
    loadCars();
    
    // Close login modal and reset form
    closeLoginModal();
    elements.loginForm.reset();
}

function logout() {
    state.isAuthenticated = false;
    state.currentUser  = null;
    updateUI();
    clearCars();
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = elements.loginEmail.value;
    const password = elements.loginPassword.value;
    
    // Find user
    const user = state.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        login(user);
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = elements.registerUsername.value;
    const email = elements.registerEmail.value;
    const password = elements.registerPassword.value;
    const confirmPassword = elements.registerConfirmPassword.value;
    
    // Validate
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (state.users.some(u => u.email === email)) {
        alert('User  with this email already exists');
        return;
    }
    
    // Create new user
    const newUser  = {
        id: state.nextUserId++,
        username,
        email,
        password
    };
    
    state.users.push(newUser );
    
    // Login the new user
    login(newUser );
}

// Car Functions
function loadCars() {
    // Simulate loading from backend
    setTimeout(() => {
        // Sample data
        if (state.cars.length === 0) {
            state.cars = [
                { 
                    id: state.nextCarId++, 
                    make: 'Ford', 
                    model: 'Mustang', 
                    year: 2020, 
                    color: 'Red', 
                    image: 'https://placehold.co/600x400', 
                    description: 'Beautiful classic Mustang with all the modern features', 
                    userId: state.currentUser .id 
                },
                { 
                    id: state.nextCarId++, 
                    make: 'Chevrolet', 
                    model: 'Camaro', 
                    year: 2018, 
                    color: 'Black', 
                    image: 'https://placehold.co/600x400', 
                    description: 'Powerful V8 engine with excellent handling', 
                    userId: state.currentUser .id 
                },
                { 
                    id: state.nextCarId++, 
                    make: 'Dodge', 
                    model: 'Charger', 
                    year: 1970, 
                    color: 'Blue', 
                    image: 'https://placehold.co/600x400', 
                    description: 'Classic muscle car with tons of character', 
                    userId: state.currentUser .id 
                }
            ];
        }
        
        renderCars();
    }, 500);
}

function renderCars() {
    elements.carsContainer.innerHTML = '';
    
    if (state.cars.length === 0) {
        elements.carsContainer.innerHTML = `
            <div class="col-span-3 text-center py-12">
                <p class="text-gray-500">No cars found. Add your first car!</p>
            </div>
        `;
        return;
    }
    
    state.cars.forEach(car => {
        const isOwnedByCurrentUser  = car.userId === state.currentUser .id;
        
        const carCard = document.createElement('div');
        carCard.className = 'car-card bg-white rounded-lg shadow-md overflow-hidden';
        carCard.innerHTML = `
            <div class="relative">
                <img src="${car.image || 'https://placehold.co/600x400'}" alt="${car.year} ${car.make} ${car.model} in ${car.color}" class="w-full h-48 object-cover">
                ${isOwnedByCurrentUser  ? `
                <div class="absolute top-2 right-2 flex space-x-2">
                    <button class="edit-car-btn w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center" data-id="${car.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="delete-car-btn w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center" data-id="${car.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
                ` : ''}
            </div>
            <div class="p-4">
                <h3 class="text-xl font-semibold text-gray-800">${car.year} ${car.make} ${car.model}</h3>
                <p class="text-gray-600 mb-2">Color: ${car.color}</p>
                <p class="text-gray-700">${car.description || 'No description provided'}</p>
                <div class="mt-4 pt-2 border-t border-gray-200">
                    <button class="view-details-btn w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                        View Details
                    </button>
                </div>
            </div>
        `;
        
        elements.carsContainer.appendChild(carCard);
    });
    
    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.edit-car-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const carId = parseInt(btn.getAttribute('data-id'));
            const car = state.cars.find(c => c.id === carId);
            if (car) openCarModal(car);
        });
    });
    
    document.querySelectorAll('.delete-car-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const carId = parseInt(btn.getAttribute('data-id'));
            const car = state.cars.find(c => c.id === carId);
            if (car) {
                openConfirmModal(
                    'Delete Car', 
                    `Are you sure you want to delete your ${car.year} ${car.make} ${car.model}?`,
                    () => deleteCar(carId)
                );
            }
        });
    });
}

function clearCars() {
    elements.carsContainer.innerHTML = `
        <div class="text-center py-12">
            <p class="text-gray-500">Please login to view cars</p>
        </div>
    `;
}

function handleCarSubmit(e) {
    e.preventDefault();
    
    const carData = {
        make: elements.carMake.value,
        model: elements.carModel.value,
        year: parseInt(elements.carYear.value),
        color: elements.carColor.value,
        image: elements.carImage.value || undefined,
        description: elements.carDescription.value || undefined,
        userId: state.currentUser .id
    };
    
    if (elements.carId.value) {
        // Update existing car
        const carId = parseInt(elements.carId.value);
        updateCar(carId, carData);
    } else {
        // Add new car
        addCar(carData);
    }
    
    closeCarModal();
}

function addCar(carData) {
    const newCar = {
        id: state.nextCarId++,
        ...carData
    };
    
    state.cars.push(newCar);
    renderCars();
}

function updateCar(carId, carData) {
    const index = state.cars.findIndex(c => c.id === carId);
    if (index !== -1) {
        state.cars[index] = {
            ...state.cars[index],
            ...carData
        };
        renderCars();
    }
}

function deleteCar(carId) {
    state.cars = state.cars.filter(c => c.id !== carId);
    renderCars();
}

function filterCars() {
    const makeFilter = elements.filterMake.value;
    const yearFilter = elements.filterYear.value;
    
    let filteredCars = state.cars;
    
    if (makeFilter) {
        filteredCars = filteredCars.filter(car => car.make === makeFilter);
    }
    
    if (yearFilter) {
        const year = parseInt(yearFilter);
        if (year >= 2020) {
            filteredCars = filteredCars.filter(car => car.year >= 2020);
        } else if (year >= 2010) {
            filteredCars = filteredCars.filter(car => car.year >= 2010 && car.year <= 2019);
        } else if (year >= 2000) {
            filteredCars = filteredCars.filter(car => car.year >= 2000 && car.year <= 2009);
        } else if (year >= 1990) {
            filteredCars = filteredCars.filter(car => car.year >= 1990 && car.year <= 1999);
        } else if (year >= 1980) {
            filteredCars = filteredCars.filter(car => car.year >= 1980 && car.year <= 1989);
        } else if (year >= 1970) {
            filteredCars = filteredCars.filter(car => car.year >= 1970 && car.year <= 1979);
        } else if (year >= 1960) {
            filteredCars = filteredCars.filter(car => car.year >= 1960 && car.year <= 1969);
        }
    }
    
    // Temporary render just the filtered cars
elements.carsContainer.innerHTML = '';
filteredCars.forEach(car => {
    const isOwnedByCurrentUser = car.userId === state.currentUser.id;
    
    const carCard = document.createElement('div');
    carCard.className = 'car-card bg-white rounded-lg shadow-md overflow-hidden';
    carCard.innerHTML = `
        <div class="relative">
            <img src="${car.image || 'https://placehold.co/600x400'}" alt="${car.year} ${car.make} ${car.model} in ${car.color}" class="w-full h-48 object-cover">
            ${isOwnedByCurrentUser ? `
            <div class="absolute top-2 right-2 flex space-x-2">
                <button class="edit-car-btn w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center" data-id="${car.id}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </button>
                <button class="delete-car-btn w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center" data-id="${car.id}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
            ` : ''}
        </div>
        <!-- Rest of car card content would go here -->
    `;
    
    elements.carsContainer.appendChild(carCard);
});}