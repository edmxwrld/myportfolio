const apiKey = "66f4083698d4df8a831e82f44d053e64"; // Your API key

async function getWeather() {
  const city = document.getElementById("cityInput").value || "Accra";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // Current weather
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) throw new Error(data.message);

    document.getElementById("city").innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("condition").innerText = data.weather[0].description;
    document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const today = new Date();
    document.getElementById("day").innerText = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });

    // Forecast (next 5 days)
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    const forecastEl = document.querySelector(".forecast");
    forecastEl.innerHTML = ""; // clear old results

    for (let i = 0; i < forecastData.list.length; i += 8) {
      const day = new Date(forecastData.list[i].dt * 1000).toLocaleDateString("en-US", {
        weekday: "short"
      });
      const temp = Math.round(forecastData.list[i].main.temp);
      const icon = forecastData.list[i].weather[0].icon;

      forecastEl.innerHTML += `
        <div class="forecast-day">
          <p>${day}</p>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="">
          <p>${temp}°C</p>
        </div>
      `;
    }

  } catch (error) {
    alert("City not found!");
  }
}

// 🔹 Event listeners
document.getElementById("searchBtn").addEventListener("click", getWeather);
document.getElementById("cityInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    getWeather();
  }
});

// Load default
getWeather();
