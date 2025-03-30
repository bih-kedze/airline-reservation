// User management
let currentUser = null;
const users = JSON.parse(localStorage.getItem('users')) || [];
const flights = JSON.parse(localStorage.getItem('flights')) || [];
const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// Initialize with some flights if empty
if (flights.length === 0) {
  const initialFlights = [
    {
      id: 1,
      from: 'Douala',
      to: 'Lagos, Nigeria',
      date: '2025-01-30', // Updated current date
      time: '08:00 AM',
      price: 120000, // Price in CFA
      duration: '1h 30m',
      airline: 'Asky Airlines'
    },
    {
      id: 2,
      from: 'Yaoundé',
      to: 'Paris, France',
      date: '2025-02-05', // Updated current date
      time: '10:00 PM',
      price: 650000, // Price in CFA
      duration: '6h 50m',
      airline: 'Air France'
    },
    {
      id: 3,
      from: 'Douala',
      to: 'Dubai, UAE',
      date: '2025-02-15', // Updated current date
      time: '09:30 PM',
      price: 720000, // Price in CFA
      duration: '7h 15m',
      airline: 'Ethiopian Airlines'
    },
    // {
    //   id: 4,
    //   from: 'Douala',
    //   to: 'Accra, Ghana',
    //   date: '2025-02-20', // Updated current date
    //   time: '06:00 AM',
    //   price: 180000, // Price in CFA
    //   duration: '2h 10m',
    //   airline: 'Kenya Airways'
    // },
    // {
    //   id: 5,
    //   from: 'Yaoundé',
    //   to: 'Johannesburg, South Africa',
    //   date: '2025-02-25', // Updated current date
    //   time: '11:15 AM',
    //   price: 500000, // Price in CFA
    //   duration: '5h 30m',
    //   airline: 'South African Airways'
    // }
  ];
  
  flights.push(...initialFlights);
  localStorage.setItem('flights', JSON.stringify(flights));
}

// Auth functions
function showAuthModal(type) {
  document.getElementById('authModal').style.display = 'block';
  document.getElementById('loginForm').classList.toggle('active', type === 'login');
  document.getElementById('signupForm').classList.toggle('active', type === 'signup');
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
}

function signup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  if (users.some(user => user.email === email)) {
    alert('Email already exists!');
    return;
  }

  const user = {name, email, password, isAdmin: users.length === 0 }; // First user is admin
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  login(email, password);
  closeAuthModal();
}

// function login(email = null, password = null) {
//   email = email || document.getElementById('loginEmail').value;
//   password = password || document.getElementById('loginPassword').value;

//   const user = users.find(u => u.email === email && u.password === password);
//   if (user) {
//     currentUser = user;
//     updateNavigation();
//     closeAuthModal();
//     // Refresh displays after login
//     displayTodayFlights();
//     displaySearchResults(flights);
//   } else {
//     alert('Invalid credentials!');
//   }
// }

function login(email = null, password = null) {
  email = email || document.getElementById('loginEmail').value;
  password = password || document.getElementById('loginPassword').value;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save to localStorage
    updateNavigation();
    closeAuthModal();
    displayTodayFlights();
    displaySearchResults(flights);
  } else {
    alert('Invalid credentials!');
  }
}


function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser'); // Remove from localStorage
  updateNavigation();
}

function updateNavigation() {
  const navButtons = document.getElementById('navButtons');
  const adminTab = document.querySelector('.admin-only');
  const userTabs = document.querySelectorAll('.customer-only');
  

  if (currentUser) {
    // navButtons.innerHTML = `
    // <span>Welcome, ${currentUser.isAdmin ? 'Admin' : 'Customer'} - ${currentUser.name}</span>
    //   <button class="nav-button" onclick="logout()">Logout</button>
    // `;
    navButtons.innerHTML = `
  <div style="
    display: flex; 
    align-items: center; 
    gap: 1rem; 
    background: linear-gradient(90deg, #6366f1, #3b82f6); 
    padding: 0.5rem 1rem; 
    border-radius: 10px; 
    color: white; 
    font-weight: 500; 
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  ">
    <span style="font-size: 0.95rem;">
      👋 Welcome, <strong>${currentUser.isAdmin ? 'Admin' : 'Customer'}</strong> - ${currentUser.name}
    </span>
    <button class="nav-button" onclick="logout()" style="
      background-color: white; 
      color: #3b82f6; 
      border: none; 
      padding: 6px 12px; 
      border-radius: 6px; 
      cursor: pointer; 
      font-weight: bold;
      transition: background 0.3s ease;
    " onmouseover="this.style.background='#e0e7ff'" onmouseout="this.style.background='white'">
      Logout
    </button>
  </div>
`;


    adminTab.classList.toggle('hidden', !currentUser.isAdmin);
    // Hide all user-only elements if the user is an admin
    userTabs.forEach(tab => tab.classList.toggle('hidden', currentUser.isAdmin));
    console.log(userTabs.forEach(tab => tab.classList.toggle('hidden', currentUser.isAdmin)));
    

  } else {
    navButtons.innerHTML = `
      <button class="nav-button" onclick="showAuthModal('login')">Login</button>
      <button class="nav-button" onclick="showAuthModal('signup')">Sign Up</button>
    `;

    adminTab.classList.add('hidden');
    // Show all user-only elements for non-logged-in users
    userTabs.forEach(tab => tab.classList.remove('hidden'));
  }
}



// Tab management
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(`${tabName}Tab`).classList.add('active');
  document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');

  if (tabName === 'today') {
    displayTodayFlights();
  } else if (tabName === 'bookings') {
    displayBookings();
  } else if (tabName === 'search') {
    displaySearchResults(flights); // Show all flights in search tab
  }
}

// Flight management
document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const fromCity = document.getElementById('fromCity').value;
  const toCity = document.getElementById('toCity').value;
  const date = document.getElementById('date').value;

  const filteredFlights = flights.filter(flight => 
    flight.from.toLowerCase().includes(fromCity.toLowerCase()) &&
    flight.to.toLowerCase().includes(toCity.toLowerCase()) &&
    (date ? flight.date === date : true)
  );

  displaySearchResults(filteredFlights);
});

document.getElementById('addFlightForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentUser?.isAdmin) {
    alert('Only admins can add flights!');
    return;
  }

  const newFlight = {
    id: Date.now(),
    from: document.getElementById('addFromCity').value,
    to: document.getElementById('addToCity').value,
    date: document.getElementById('addDate').value,
    time: document.getElementById('addTime').value,
    airline: document.getElementById('addAirline').value,
    price: Number(document.getElementById('addPrice').value),
    duration: document.getElementById('addDuration').value
  };

  flights.push(newFlight);
  localStorage.setItem('flights', JSON.stringify(flights));
  alert('Flight added successfully!');
  e.target.reset();
  
  // Refresh displays after adding a flight
  displayTodayFlights();
  displaySearchResults(flights);
});

function displaySearchResults(filteredFlights) {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '<h2>Available Flights</h2>';

  if (filteredFlights.length === 0) {
    searchResults.innerHTML += '<p>No flights found.</p>';
    return;
  }

  filteredFlights.forEach(flight => {
    const flightCard = createFlightCard(flight);
    searchResults.appendChild(flightCard);
  });
}

function displayTodayFlights() {
  const today = new Date().toISOString().split('T')[0];
  const todayFlights = flights.filter(flight => flight.date === today);
  const container = document.getElementById('todayFlights');
  
  container.innerHTML = '';
  
  if (todayFlights.length === 0) {
    container.innerHTML = '<p>No flights scheduled for today.</p>';
    return;
  }

  todayFlights.forEach(flight => {
    const flightCard = createFlightCard(flight);
    container.appendChild(flightCard);
  });
}

function createFlightCard(flight) {
  const div = document.createElement('div');
  div.className = 'flight-card';
  div.innerHTML = `
    <div class="flight-header">
      <div class="flight-route">
        <span>${flight.from}</span>
        <span>✈️</span>
        <span>${flight.to}</span>
      </div>
      <div style="color: #4b5563">${flight.airline}</div>
    </div>
    <div class="flight-details">
      <div class="flight-info">
        <div class="flight-info-label">Date</div>
        <div>${flight.date}</div>
      </div>
      <div class="flight-info">
        <div class="flight-info-label">Time</div>
        <div>${flight.time}</div>
      </div>
      <div class="flight-info">
        <div class="flight-info-label">Duration</div>
        <div>${flight.duration}</div>
      </div>
      <div class="flight-info">
  <div class="flight-price">${flight.price} FCFA</div>
  ${(() => {
    if (currentUser && !currentUser.isAdmin) {
      console.log('currentUser', currentUser);
      
      return `<button class="select-button customer-only" onclick="bookFlight(${flight.id})">Book Now</button>`;
    }
    else if (currentUser && currentUser.isAdmin) {
      return `<button class="select-button customer-only hidden" onclick="bookFlight(${flight.id})">Book Now</button>`;
    }
    
    else {
      return `<button class="select-button" onclick="showAuthModal('login')">Login to Book</button>`;
    }
  })()}
</div>
  `;
  return div;
}

function bookFlight(flightId) {
  if (!currentUser) return;

  const flight = flights.find(f => f.id === flightId);
  if (!flight) {
    alert('Flight not found!');
    return;
  }

  const booking = {
    id: Date.now(),
    userId: currentUser.email,
    flightId,
    bookingDate: new Date().toISOString(),
    passengers: Number(document.getElementById('passengers').value) || 1
  };

  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  showTicket(booking, flight);
}

function displayBookings() {
  if (!currentUser) return;

  const userBookings = bookings.filter(booking => booking.userId === currentUser.email);
  const container = document.getElementById('bookingsList');
  container.innerHTML = '';

  if (userBookings.length === 0) {
    container.innerHTML = '<p>No bookings found.</p>';
    return;
  }

  userBookings.forEach(booking => {
    const flight = flights.find(f => f.id === booking.flightId);
    if (!flight) return;

    const div = document.createElement('div');
    div.className = 'flight-card';
    div.innerHTML = `
      <div class="flight-header">
        <div class="flight-route">
          <span>${flight.from}</span>
          <span>✈️</span>
          <span>${flight.to}</span>
        </div>
        <div style="color: #4b5563">Booked on: ${new Date(booking.bookingDate).toLocaleDateString()}</div>
      </div>
      <div class="flight-details">
        <div class="flight-info">
          <div class="flight-info-label">Flight Date</div>
          <div>${flight.date}</div>
        </div>
        <div class="flight-info">
          <div class="flight-info-label">Passengers</div>
          <div>${booking.passengers}</div>
        </div>
        <div class="flight-info">
          <div class="flight-price">${flight.price * booking.passengers}FCFA</div>
          <button class="select-button" onclick="showTicketById(${booking.id})">View Ticket</button>
          <button class="select-button cancel-button" onclick="cancelBooking(${booking.id})">Cancel</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function showTicket(booking, flight) {
  const modal = document.getElementById('ticketModal');
  const content = document.getElementById('ticketContent');
  
  content.innerHTML = `
    <div class="ticket-content">
      <div class="ticket-header">
        <div class="ticket-logo">✈️</div>
        <h2>Boarding Pass</h2>
      </div>
      
      <div class="ticket-details">
        <div class="ticket-info">
          <div class="ticket-label">From</div>
          <div class="ticket-value">${flight.from}</div>
        </div>
        <div class="ticket-info">
          <div class="ticket-label">To</div>
          <div class="ticket-value">${flight.to}</div>
        </div>
        <div class="ticket-info">
          <div class="ticket-label">Date</div>
          <div class="ticket-value">${flight.date}</div>
        </div>
        <div class="ticket-info">
          <div class="ticket-label">Time</div>
          <div class="ticket-value">${flight.time}</div>
        </div>
        <div class="ticket-info">
          <div class="ticket-label">Passengers</div>
          <div class="ticket-value">${booking.passengers}</div>
        </div>
        <div class="ticket-info">
          <div class="ticket-label">Booking Reference</div>
          <div class="ticket-value">${booking.id}</div>
        </div>
      </div>
      
      <div class="ticket-barcode">
        ||||||||||||||||||||||||||
        <div style="font-size: 0.75rem; margin-top: 0.5rem;">
          ${booking.id}
        </div>
      </div>
    </div>
  `;
  
  modal.style.display = 'block';
}

function showTicketById(bookingId) {
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) {
    alert('Booking not found!');
    return;
  }

  const flight = flights.find(f => f.id === booking.flightId);
  console.log('flight', flight);
  if (!flight) {
    alert('Flight not found!');
    return;
  }

  showTicket(booking, flight);
}


function cancelBooking(bookingId) {
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      bookings.splice(index, 1);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      displayBookings(); // Refresh the booking list
      alert("Booking canceled.");
    }
  }
}


function closeTicketModal() {
  document.getElementById('ticketModal').style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }

  updateNavigation();
  displayTodayFlights();
  displaySearchResults(flights);
});
