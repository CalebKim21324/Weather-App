const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const inputField = document.querySelector('.search-box input');
const countryImageContainer = document.getElementById('countryImageContainer');

const weatherAPIKey = '27d681204defde289080a061d8596ef2';
const unsplashAccessKey = 't03ELBLjw-3dKxIShVcPdxmJtcwfqv79iuw6Olu1Ksk'; // Replace with your Unsplash Access Key

// Event handler function for weather search
function handleSearch() {
    const city = inputField.value;

    // If the city is empty, then print nothing.
    if(city === '') 
        return;

    fetchWeather(city);
    fetchCountryImage(city);
}

// Fetch weather information
function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';       
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch(json.weather[0].main) {
                case 'Clear':
                    image.src = 'assets/clear.png';
                    break;
                
                case 'Rain':
                    image.src = 'assets/rain.png';
                    break;
                    
                case 'Snow':
                    image.src = 'assets/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'assets/cloud.png';
                    break;
                        
                case 'Haze':
                    image.src = 'assets/mist.png';
                    break;
                
                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°F</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '600px';
            container.style.boxShadow = '10px 10px 5px 2px rgba(0, 0, 0, 0.3)';
        });
}

// Fetch country image from Unsplash
function fetchCountryImage(country) {
    fetch(`https://api.unsplash.com/search/photos?query=${country}&client_id=${unsplashAccessKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const imageUrl = data.results[0].urls.regular;
                displayCountryImage(imageUrl);
                displayName(country);
            } else {
                displayMessage('No images found for the given country.');
            }
        })
        .catch(error => {
            console.error('Error fetching image:', error);
            displayMessage('Error fetching image.');
        });
}

function displayCountryImage(imageUrl) {
    countryImageContainer.innerHTML = `<img src="${imageUrl}" alt="Country Image" style="max-height: 600px; border-radius: 18px;">`;
    countryImageContainer.style.height = '600px';
    countryImageContainer.style.borderRight ='10px';
    countryImageContainer.style.opacity = '0.80';
    countryImageContainer.style.borderRadius = '18px';
    countryImageContainer.style.overflow = 'hidden';  // Ensures that the image respects the container's border-radius
    countryImageContainer.style.boxShadow = '10px 10px 5px 2px rgba(0, 0, 0, 0.3)';
}

function displayMessage(message) {
    countryImageContainer.innerHTML = `<p>${message}</p>`;
}

function displayName(name) {
    // Ensure the container has position: relative for absolute positioning to work inside it
    countryImageContainer.style.position = 'relative';

    countryImageContainer.innerHTML += `
        <p style="
            position: absolute;
            bottom: 10px;
            right: 10px;
            margin: 0;
            padding: 5px 10px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            font-size: 24px;
            border-radius: 8px;
            text-transform: capitalize;
        ">
            ${name}
        </p>
    `;
}

// Event listeners
search.addEventListener('click', handleSearch);
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
