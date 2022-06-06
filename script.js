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
    .catch((error) => {
      throw new Error(`${error}`);
    });
}

function extractData(data) {
  const cityStats = {
    city: `${data.name}, ${data.sys.country}`,
    time: `${secsToTime(Math.floor(Date.now() / 1000) + data.timezone)}`,
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
}

function secsToTime(seconds) {
  return new Date(1000 * seconds).toISOString().substring(11, 16);
}

fetchWeatherDataAPI('parana');
