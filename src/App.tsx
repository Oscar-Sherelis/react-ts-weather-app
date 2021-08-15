import React, { useState, useEffect } from "react";
import { City } from "country-state-city";
import "./custom.css";

const App = () => {
  const [cities, setCities] = useState<any[]>([]);
  const [suggestions, setsuggestions] = useState<any[]>([]);
  const [clicked, setClicked] = useState<boolean>(false);

  // selected city weather result states
  const [description, setDescription] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [wind, setWind] = useState<string>("");
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadUsers = async () => {
      let response = [] as any;
      response = City.getAllCities();
      setCities(response);
    };
    loadUsers();
  }, []);

  const loadCityData = async (cityName: string) => {
    setDescription("");
    setTemperature("");
    setWind("");
    setForecast([]);
    setLoading(false);

    let fetchString: string =
      "https://goweather.herokuapp.com/weather/" + cityName;
    let response = await (await fetch(fetchString)).json();
    setDescription(response.description);
    setTemperature(response.temperature);
    setWind(response.wind);
    setForecast(response.forecast);
    setLoading(true);
  };
  const getCity = (cityName: string) => {
    setClicked(true);
    loadCityData(cityName);
  };

  const onChangeHandler = (text: string) => {
    let matches: any = [];
    if (text.length > 0) {
      setClicked(false);
    }
    if (text.length >= 3) {
      matches = cities.filter((city) => {
        const regex = new RegExp(`${text}`, "gi");
        return city.name.match(regex);
      });
      setsuggestions(matches);
    } else {
      setsuggestions([]);
    }
  };
  return (
    <section>
      <h1>Weather app</h1>
      <form>
        <input
          type="text"
          onChange={(e) => onChangeHandler(e.target.value)}
          placeholder="Enter city"
        />
      </form>
      {!clicked ? (
        <div className="suggestions">
          {suggestions &&
            suggestions.map((suggestion: { name: string }, i: number) => (
              <p
                className="city-to-select"
                onClick={() => {
                  getCity(suggestion.name);
                }}
                key={i}
              >
                {suggestion.name}
              </p>
            ))}
        </div>
      ) : (
        <div className="result">
          {loading ? (
            <div className="today">
              {forecast && forecast.length > 0}
              <div className="today__description">
                <div>
                  <h3>Today</h3>
                  <h4>{description && description}</h4>
                </div>
                <div>
                  <h3>Temperature</h3>
                  <h4>{temperature && temperature}</h4>
                </div>
                <div>
                  <h3>Wind</h3>
                  <h4>{wind && wind}</h4>
                </div>
              </div>
              <div className="for-next-days">
                <h3>For next {forecast && forecast.length} days</h3>
                {forecast &&
                  forecast.map(
                    (
                      singleForecast: {
                        day: string;
                        temperature: string;
                        wind: string;
                      },
                      i: number
                    ) => (
                      <div key={i} className="forecast">
                        <h4>{singleForecast.day}</h4>
                        <h4>
                          {singleForecast.temperature.length >= 4
                            ? singleForecast.temperature
                            : "No data"}
                        </h4>
                        <h4>
                          {singleForecast.wind.length >= 6
                            ? singleForecast.wind
                            : "No data"}
                        </h4>
                      </div>
                    )
                  )}
              </div>
            </div>
          ) : (
            <h4>Loading</h4>
          )}
        </div>
      )}
    </section>
  );
};

export default App;
