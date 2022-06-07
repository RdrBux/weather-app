async function fetchWeatherDataAPI(city) {
  const promise = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=c90d91ec157c4b875dc5421e65879dbd`,
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
    temp: `${data.main.temp}`,
    feelsLike: `${data.main.feels_like}`,
    humidity: `${data.main.humidity}%`,
    windDir: `${data.wind.deg}`,
    windSpeed: `${data.wind.speed}`,
    timezone: `${data.timezone}`,
  };
  console.log(cityStats);
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

function displayData(obj) {
  const city = document.querySelector('.js-city');
  const day = document.querySelector('.js-day');
  const temp = document.querySelector('.js-temp');
  const feelsLike = document.querySelector('.js-feels-like');
  const sunrise = document.querySelector('.js-sunrise');
  const sunset = document.querySelector('.js-sunset');
  const windSpeed = document.querySelector('.js-wind-speed');
  const humidity = document.querySelector('.js-humidity');

  city.textContent = obj.city;
  day.textContent = obj.day;
  temp.textContent = obj.temp;
  feelsLike.textContent = obj.feelsLike;
  sunrise.textContent = obj.sunrise;
  sunset.textContent = obj.sunset;
  windSpeed.textContent = obj.windSpeed;
  humidity.textContent = obj.humidity;
}

fetchWeatherDataAPI('buenos aires');
