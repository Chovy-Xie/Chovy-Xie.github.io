/**
 * Location API Integration
 * Uses Google Maps API to find and display nearby stores
 */

// Global variables for map and location
let map;
let userLocation;
let markers = [];
let infoWindow;
let storesList = [];

// Initialize map (callback for Google Maps API)
function initMap() {
    console.log("Map initialization bypassed - using static map instead");
}

/**
 * Handle location error
 * @param {boolean} browserHasGeolocation - Whether browser supports geolocation
 */
function handleLocationError(browserHasGeolocation) {
    const errorMessage = browserHasGeolocation
        ? "Error: The Geolocation service failed. We can't find stores near you."
        : "Error: Your browser doesn't support geolocation. We can't find stores near you.";
    
    // Show error message in store list
    const storeListElement = document.getElementById('store-list');
    if (storeListElement) {
        storeListElement.innerHTML = `<p class="location-error">${errorMessage}</p>`;
    }
}

/**
 * Add user location marker to map
 * @param {Object} location - User's location coordinates
 */
function addUserMarker(location) {
    const userMarker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(38, 38)
        },
        title: 'Your Location'
    });
    
    markers.push(userMarker);
    
    userMarker.addListener('click', () => {
        infoWindow.setContent('<div class="info-window"><strong>Your Location</strong></div>');
        infoWindow.open(map, userMarker);
    });
}

/**
 * Find nearby iTea stores
 * @param {Object} location - Location to search around
 */
function findNearbyStores(location) {
    // In a real application, we would use the Places API to search for nearby stores
    // For this demo, we'll use mock data for tea stores
    
    // Simulate API call delay
    setTimeout(() => {
        // Generate mock store data around the given location
        storesList = generateMockStores(location);
        
        // Add store markers to map
        addStoreMarkers(storesList);
        
        // Display stores in list
        displayStoresList(storesList);
    }, 500);
}

/**
 * Generate mock store data around given location
 * @param {Object} center - Center location to generate stores around
 * @returns {Array} Array of mock store data
 */
function generateMockStores(center) {
    const stores = [];
    
    // Store names
    const storeNames = [
        'iTea Downtown',
        'iTea Midtown',
        'iTea Uptown',
        'iTea Express',
        'iTea Café',
        'iTea University'
    ];
    
    // Generate 5 stores with random offsets from center
    for (let i = 0; i < storeNames.length; i++) {
        // Random offset from center (within ~2 miles)
        const latOffset = (Math.random() - 0.5) * 0.04;
        const lngOffset = (Math.random() - 0.5) * 0.04;
        
        // Random store hours
        const openHour = 7 + Math.floor(Math.random() * 3); // 7-9 AM
        const closeHour = 19 + Math.floor(Math.random() * 3); // 7-9 PM
        
        // Random rating
        const rating = 3.5 + Math.random() * 1.5; // 3.5-5.0
        
        stores.push({
            id: i + 1,
            name: storeNames[i],
            location: {
                lat: center.lat + latOffset,
                lng: center.lng + lngOffset
            },
            address: `${Math.floor(Math.random() * 1000) + 100} ${['Main', 'Oak', 'Maple', 'Park', 'Center', 'Broadway'][Math.floor(Math.random() * 6)]} St`,
            phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            hours: `${openHour}:00 AM - ${closeHour - 12}:00 PM`,
            rating: rating.toFixed(1),
            totalRatings: Math.floor(Math.random() * 500) + 50
        });
    }
    
    return stores;
}

/**
 * Add store markers to the map
 * @param {Array} stores - Array of store data
 */
function addStoreMarkers(stores) {
    // Clear any existing markers (except user location marker)
    markers.slice(1).forEach(marker => marker.setMap(null));
    markers = markers.slice(0, 1); // Keep only user location marker
    
    // Add markers for each store
    stores.forEach(store => {
        const marker = new google.maps.Marker({
            position: store.location,
            map: map,
            title: store.name,
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(32, 32)
            }
        });
        
        // Create info window content
        const content = `
            <div class="info-window">
                <h3>${store.name}</h3>
                <p>${store.address}</p>
                <p>${store.phone}</p>
                <p>Hours: ${store.hours}</p>
                <div class="store-rating">
                    <span class="rating-stars">${getRatingStars(store.rating)}</span>
                    <span class="rating-number">${store.rating} (${store.totalRatings})</span>
                </div>
                <a href="https://maps.google.com/maps?q=${store.location.lat},${store.location.lng}" 
                   target="_blank" class="directions-link">Get Directions</a>
            </div>
        `;
        
        // Add click listener to show info window
        marker.addListener('click', () => {
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });
        
        markers.push(marker);
    });
}

/**
 * Display stores in list
 * @param {Array} stores - Array of store data
 */
function displayStoresList(stores) {
    const storeListElement = document.getElementById('store-list');
    if (!storeListElement) return;
    
    storeListElement.innerHTML = '';
    
    stores.forEach(store => {
        const storeElement = document.createElement('div');
        storeElement.className = 'store-item';
        
        storeElement.innerHTML = `
            <h4>${store.name}</h4>
            <p class="store-address">${store.address}</p>
            <p class="store-phone">${store.phone}</p>
            <p class="store-hours">Hours: ${store.hours}</p>
            <div class="store-rating">
                <span class="rating-stars">${getRatingStars(store.rating)}</span>
                <span class="rating-number">${store.rating} (${store.totalRatings})</span>
            </div>
            <button class="view-on-map-btn" data-store-id="${store.id}">View on Map</button>
        `;
        
        // Add click listener to highlight store on map
        const viewOnMapBtn = storeElement.querySelector('.view-on-map-btn');
        viewOnMapBtn.addEventListener('click', () => {
            const storeMarker = markers[store.id]; // +1 for user marker
            map.panTo(store.location);
            map.setZoom(15);
            infoWindow.setContent(storeElement.innerHTML);
            infoWindow.open(map, storeMarker);
        });
        
        storeListElement.appendChild(storeElement);
    });
}

/**
 * Get HTML star rating display
 * @param {number} rating - Numerical rating
 * @returns {string} HTML string with star icons
 */
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Custom map styling
const mapStyles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#c9e2f5"
            },
            {
                "visibility": "on"
            }
        ]
    }
];

// Add styling for map and store list
const style = document.createElement('style');
style.textContent = `
.location-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.location-container h3 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: #212121;
}

.map {
    width: 100%;
    height: 400px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.store-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.store-item {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.store-item h4 {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}

.store-address, .store-phone, .store-hours {
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
}

.store-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.rating-stars {
    color: #f5a623;
}

.rating-number {
    color: #666;
    font-size: 0.9rem;
}

.view-on-map-btn {
    background-color: #06c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
}

.view-on-map-btn:hover {
    background-color: #0055b3;
}

.info-window {
    min-width: 200px;
    max-width: 300px;
}

.info-window h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}

.info-window p {
    margin: 0.3rem 0;
    color: #666;
    font-size: 0.9rem;
}

.directions-link {
    display: inline-block;
    margin-top: 0.5rem;
    color: #06c;
    text-decoration: none;
    font-size: 0.9rem;
}

.directions-link:hover {
    text-decoration: underline;
}

.location-error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.75rem;
    border-radius: 0.25rem;
    text-align: center;
}

@media (max-width: 768px) {
    .map {
        height: 300px;
    }
}
`;
document.head.appendChild(style);

// Add click functionality to direction buttons
document.addEventListener('DOMContentLoaded', function() {
    // Sample store coordinates (for demonstration)
    const storeLocations = [
        { name: "iTea Downtown", lat: 37.7749, lng: -122.4194 },
        { name: "iTea Uptown", lat: 37.7847, lng: -122.4289 },
        { name: "iTea Westside", lat: 37.7694, lng: -122.4862 },
        { name: "iTea University", lat: 37.7862, lng: -122.4101 }
    ];
    
    // Add click handlers to direction buttons
    const directionBtns = document.querySelectorAll('.directions-btn');
    directionBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const store = storeLocations[index];
            if (store) {
                // Open Google Maps directions in a new tab
                window.open(`https://maps.google.com/maps?q=${store.lat},${store.lng}`, '_blank');
            }
        });
    });
    
    // Make store items clickable
    const storeItems = document.querySelectorAll('.store-item');
    storeItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking the direction button
            if (!e.target.classList.contains('directions-btn')) {
                const store = storeLocations[index];
                if (store) {
                    // Open Google Maps in a new tab
                    window.open(`https://maps.google.com/maps?q=${store.name.replace(' ', '+')}&ll=${store.lat},${store.lng}&z=15`, '_blank');
                }
            }
        });
    });
});

// Fallback for when Google Maps fails to load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const mapElement = document.getElementById('map');
        const storeList = document.getElementById('store-list');
        
        if (mapElement && mapElement.innerHTML === '' && typeof google === 'undefined') {
            // Google Maps failed to load, display static map instead
            mapElement.innerHTML = `
                <div class="map-fallback">
                    <img src="https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=12&size=600x400&markers=color:green%7C40.7128,-74.0060&key=AIzaSyA5q_08IIQvVY06TPUgADTLwMG5Q7qDhTA" alt="Store Map" style="width:100%; border-radius:8px;">
                    <p class="map-fallback-text">Interactive map could not be loaded. Please check your internet connection.</p>
                </div>
            `;
            
            storeList.innerHTML = `
                <div class="store-item">
                    <h4>iTea Downtown</h4>
                    <p>123 Main Street, Downtown</p>
                </div>
                <div class="store-item">
                    <h4>iTea Uptown</h4>
                    <p>456 Park Avenue, Uptown</p>
                </div>
                <div class="store-item">
                    <h4>iTea Westside</h4>
                    <p>789 Ocean Blvd, Westside</p>
                </div>
            `;
        }
    }, 3000); // Wait 3 seconds to check if Google Maps loaded
}); 