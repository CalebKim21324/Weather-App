// Variables 
const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const inputField = document.querySelector('.search-box input');

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
            container.style.height = '590px';
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
    const countryImageContainer = document.getElementById('countryImageContainer');
    if (!countryImageContainer) {
        const newImageContainer = document.createElement('div');
        newImageContainer.id = 'countryImageContainer';
        newImageContainer.style.marginTop = '20px';
        container.appendChild(newImageContainer);
    } else {
        countryImageContainer.innerHTML = `<img src="${imageUrl}" alt="Country Image" style="max-width: 100%;">`;
    }
}

function displayMessage(message) {
    const countryImageContainer = document.getElementById('countryImageContainer');
    if (!countryImageContainer) {
        const newImageContainer = document.createElement('div');
        newImageContainer.id = 'countryImageContainer';
        newImageContainer.style.marginTop = '20px';
        newImageContainer.innerHTML = `<p>${message}</p>`;
        container.appendChild(newImageContainer);
    } else {
        countryImageContainer.innerHTML = `<p>${message}</p>`;
    }
}

// Event listeners
search.addEventListener('click', handleSearch);
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
