/* creat input  
let input = document.createElement("input");
let p = document.getElementsByClassName("planet")[0];
let world = document.getElementById("world");
input.type = "text";
input.className = "city";

world.appendChild(input);*/

// Execute a function when the user presses a key on the keyboard
let input = document.getElementById("serchCity");
input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    console.log("pressed enter!");
    searchAndFetch();
  }
});

/* onClick text disappear */
let p = document.getElementById("planet");
p.addEventListener("click", (event) => {
  console.log("arrow function called", event);
  //world.style.fontSize = "0px";
  p.classList.add("searching");
  input.focus();
  clear();
});
async function getWeather(lat, long) {
  console.log(lat, long);
  //https://api.open-meteo.com/v1/forecast?latitude=53.5507&longitude=9.993&current=temperature_2m,apparent_temperature,is_day,rain,weather_code
  //https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min
  let url =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    lat +
    "&longitude=" +
    long +
    "&current=temperature_2m,apparent_temperature,snowfall,is_day,rain,weather_code&daily=temperature_2m_max,temperature_2m_min";
  console.log(url);
  let weatherResponse = await fetch(url);
  let weaterData = await weatherResponse.json();
  return weaterData;
}
/*get city name*/
async function searchAndFetch() {
  let cityName = document.getElementById("serchCity").value;
  console.log(cityName);
  //https://geocoding-api.open-meteo.com/v1/search?name=hamburg

  let response = await fetch(
    "https://geocoding-api.open-meteo.com/v1/search?name=" + cityName
  );
  console.log("after calling fetchMyApi");
  let result = await response.json();
  console.log(result);
  let firstCity = result.results[0];

  input.value = firstCity.name;
  let weather = await getWeather(firstCity.latitude, firstCity.longitude);
  console.log("weather", weather);
  //let debugContainer = document.getElementById("debug");
  //debugContainer.innerHTML = JSON.stringify(weather, null, 2);

  // render the weather in the html
  render(weather);
}

function render(weather) {
  let max = document.getElementById("maxTemp");
  let min = document.getElementById("minTemp");
  let tempo = document.getElementById("temperature");
  max.innerHTML = weather.daily.temperature_2m_max[0];
  min.innerHTML = weather.daily.temperature_2m_min[0];
  tempo.innerHTML = weather.current.temperature_2m + "°C";

  let number = document.getElementById("condition");
  console.log("number");
  let code = weather.current.weather_code;
  let imageName = "";
  if (code == 0) imageName = "sun";
  if (code == 1 || code == 2 || code == 3) imageName = "cloud";
  if (code == 51 || code == 53 || code == 55) imageName = "cloud-drizzle";
  if (code == 80 || code == 81 || code == 82) imageName = "cloud-rain";
  if (code == 71 || code == 73 || code == 75) imageName = "cloud-snow";
  if (code == 95 || code == 96 || code == 99) imageName = "cloud-lightning";
  //number.innerHTML = imageName;
  // https://github.com/feathericons/feather#3-use-1
  number.innerHTML = feather.icons[imageName].toSvg({ width: 40, height: 40 });

  document.getElementById("planet").classList.add("dataFetched");
}
function clear() {
  input.value = "";
  document.getElementById("planet").classList.remove("dataFetched");
}
