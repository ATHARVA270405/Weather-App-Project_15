// Array of degrees for the week
let degreesForWeek = [27, 47, 12, 89, 45, 49, 60];
const searchIcon = document.getElementById('search-icon');
const searchInput = document.getElementById('search-input');
const searchContainer = document.querySelector('.search-container');

searchIcon.addEventListener('click', function() {
    searchContainer.classList.toggle('expanded'); // Toggle the expanded state
    searchInput.focus(); // Automatically focus on input when expanded
    
    if (searchContainer.classList.contains('expanded')) {
        searchIcon.classList.add('hide'); // Hide the search icon when expanded
    }
});

searchInput.addEventListener('blur', function() {
    if (searchInput.value === '') { // If input is empty, revert the search bar
        searchContainer.classList.remove('expanded');
        searchIcon.classList.remove('hide'); // Show the search icon again
    }
});

// Function to fetch weather data
async function fetchWeather(city) {
    const apiKey = '5c3d326d343a38742e09af2d8e6c4b90'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        const temperature = data.main.temp;
        const cityName = data.name; // City name from API
        const country = data.sys.country; // Country code from API
        const highTemp = data.main.temp_max; // Get the high temperature
        const lowTemp = data.main.temp_min;  // Get the low temperature

        // Handle state (only for US cities, provided in OpenWeatherMap)
        let state = '';
        if (data.sys.country === 'US' && data.hasOwnProperty('state')) {
            state = data.state; // Get state if it exists
        }

        document.querySelector('.temp-1').textContent = `${temperature}°C`; // Update temp-1 with the fetched temperature
        
          // Update location with city, state (if available), and country
        document.querySelector('.location').textContent = state 
        ? `${cityName}, ${state}, ${country}`  // If state exists
        : `${cityName}, ${country}`;           // If no state

         // Update high and low temperature
         document.querySelector('.high').textContent = `H ${highTemp}°C`; // Update high temp
         document.querySelector('.low').textContent = `L ${lowTemp}°C`;   // Update low temp

         // Call function to update weather description based on temperature
        updateWeatherDescription(temperature);

          // Update degrees for the week (in this example, we're using a static array)
        updateWeeklyTemperatures(degreesForWeek);

        // Get today's index (0=Sunday, 6=Saturday)
        const todayIndex = new Date().getDay();
        highlightCurrentDay(todayIndex);


    // Update date and day
    updateDate();
    
         } catch (error) {
        document.querySelector('.temp-1').textContent = 'City not found'; // Error handling
    }
}
// Function to update the degrees below each day
function updateWeeklyTemperatures(degrees) {
    for (let i = 1; i <= 7; i++) {
        document.querySelector(`.d${i}`).textContent = `${degrees[i - 1]}°C`;
    }
}

// Function to highlight current day and temperature
function highlightCurrentDay(todayIndex) {
    const degreeElements = document.querySelectorAll('.degree p');

    degreeElements.forEach((el, index) => {
        if (index == todayIndex) {
            // Highlight today's temperature
            el.classList.add('.active');
        } else {
            // Remove highlight from other days
            el.classList.remove('.active');
        }
    });
}


// Function to update weather description based on temperature
function updateWeatherDescription(temperature) {
    let description;

    // Nested if-else to check temperature range and assign weather description
    if (temperature <= 0) {
        description = "Freezing Cold";
    } else if (temperature > 0 && temperature <= 10) {
        description = "Very Cold";
    } else if (temperature > 10 && temperature <= 20) {
        description = "Cold with Cloudy";
    } else if (temperature > 20 && temperature <= 30) {
        description = "Mild and Pleasant";
    } else if (temperature > 30 && temperature <= 40) {
        description = "Warm and Sunny";
    } else if (temperature > 40) {
        description = "Extremely Hot";
    } else {
        description = "Unknown Weather"; // Fallback in case of unexpected values
    }

    // Update the div with the class "H1" to show the new weather description
    document.querySelector('.H1').innerHTML = `${description}`;
}


// Function to get current day and date
function updateDate() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    
    const dayName = daysOfWeek[today.getDay()]; // Get current day name
    const date = today.getDate(); // Get current date
    const month = today.toLocaleString('default', { month: 'long' }); // Get current month name
    
    document.querySelector('.day').textContent = `(${dayName}, ${month} ${date})`; // Update day with the format (Day, Month Date)
}
// Event listener for search input
document.getElementById('search-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const city = event.target.value.trim(); // Get the user input (city name)
        if (city) {
            fetchWeather(city); // Fetch the weather for the entered city
        }
    }
});
// Call this function initially to show temperatures before search
updateWeeklyTemperatures(degreesForWeek);
highlightCurrentDay(new Date().getDay());

