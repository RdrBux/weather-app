let unitsToDisplay = 'metric';

async function fetchWeatherDataAPI(city, units = 'metric') {
  const promise = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&APPID=c90d91ec157c4b875dc5421e65879dbd`,
    {
      mode: 'cors',
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => extractData(data))
    .then((obj) => displayData(obj))
    .catch((error) => {
      throw new Error(`${error}`);
    });
}

function extractData(data) {
  const cityStats = {
    city: `${data.name}, ${data.sys.country}`,
    day: `${secsToTime(Math.floor(Date.now() / 1000) + data.timezone, 0)}`,
    sunrise: `${secsToTime(data.sys.sunrise + data.timezone)}`,
    sunset: `${secsToTime(data.sys.sunset + data.timezone)}`,
    weather: `${data.weather[0].main}`,
    weatherDesc: `${data.weather[0].description}`,
    weatherIcon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    temp: `${Math.round(data.main.temp)}`,
    feelsLike: `${data.main.feels_like}`,
    humidity: `${data.main.humidity}%`,
    windDir: `${data.wind.deg}`,
    windCard: windDegreeToCardinal(data.wind.deg),
    windSpeed: `${data.wind.speed}`,
    timezone: `${data.timezone}`,
  };
  return cityStats;
}

function secsToTime(seconds, fix = 1) {
  if (fix === 0) {
    return new Date(1000 * seconds).toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return new Date(1000 * seconds).toISOString().substring(11, 16);
}

function windDegreeToCardinal(num) {
  const n = Number(num);
  function between(x, min, max) {
    return x >= min && x < max;
  }
  if (between(n, 22.5, 67.5)) {
    return 'Northeast';
  }
  if (between(n, 67.5, 112.5)) {
    return 'East';
  }
  if (between(n, 112.5, 157.5)) {
    return 'Southeast';
  }
  if (between(n, 157.5, 202.5)) {
    return 'South';
  }
  if (between(n, 202.5, 247.5)) {
    return 'Southwest';
  }
  if (between(n, 247.5, 292.5)) {
    return 'West';
  }
  if (between(n, 292.5, 337.5)) {
    return 'Northwest';
  }
  return 'North';
}

function displayData(obj) {
  const city = document.querySelector('.js-city');
  const day = document.querySelector('.js-day');
  const temp = document.querySelector('.js-temp');
  const feelsLike = document.querySelector('.js-feels-like');
  const sunrise = document.querySelector('.js-sunrise');
  const sunset = document.querySelector('.js-sunset');
  const windSpeed = document.querySelector('.js-wind-speed');
  const humidity = document.querySelector('.js-humidity');
  const windArrow = document.querySelector('.js-wind-arrow');
  const windDir = document.querySelector('.js-wind-dir');
  const bodyBG = document.querySelector('body');
  const unitsDisplay = document.querySelectorAll('.units-display');
  const windUnits = document.querySelector('.wind-units');
  const weatherInfo = (document.getElementById('js-weather').src =
    obj.weatherIcon);
  const weatherDesc = document.querySelector('.js-weather-desc');

  city.textContent = obj.city;
  day.textContent = obj.day;
  temp.textContent = obj.temp;
  feelsLike.textContent = obj.feelsLike;
  sunrise.textContent = obj.sunrise;
  sunset.textContent = obj.sunset;
  windSpeed.textContent = obj.windSpeed;
  humidity.textContent = obj.humidity;
  windArrow.style.transform = `rotate(${obj.windDir}deg)`;
  windDir.textContent = obj.windCard;
  bodyBG.style.backgroundImage = backgroundSelector(obj.weather);
  unitsDisplay.forEach((unit) =>
    unitsToDisplay === 'metric'
      ? (unit.textContent = '°C')
      : (unit.textContent = '°F')
  );
  windUnits.textContent = unitsToDisplay === 'metric' ? 'm/s' : 'mph';
  console.log(weatherInfo);
  weatherDesc.textContent = obj.weatherDesc;
}

function backgroundSelector(str) {
  let bg;
  switch (str) {
    case 'Thunderstorm':
    case 'Drizzle':
    case 'Rain':
      bg = 'rain';
      break;
    case 'Clear':
      bg = 'clear';
      break;
    case 'Snow':
      bg = 'snow';
      break;
    case 'Clouds':
      bg = 'cloud';
      break;
    default:
      bg = 'mist';
      break;
  }
  return `url('./img/bg-${bg}.svg')`;
}

fetchWeatherDataAPI('paris', unitsToDisplay);

const form = document.querySelector('#search');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  fetchWeatherDataAPI(formProps.city, unitsToDisplay);
});

const unitsBtn = document.querySelector('.unit');
unitsBtn.addEventListener('click', (e) => {
  unitsToDisplay = unitsToDisplay === 'metric' ? 'imperial' : 'metric';
  unitsBtn.textContent = unitsToDisplay === 'metric' ? '°C' : '°F';
  const formCity = document.getElementById('city').value;
  fetchWeatherDataAPI(formCity, unitsToDisplay);
});
