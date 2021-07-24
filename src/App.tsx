import React, { useState, useEffect } from "react";
// import { ICountry, IState, ICity } from 'country-state-city'
import { Country, State, City } from 'country-state-city';
import './custom.css'

export interface Props {

}

const App: React.FC<Props> = () => {
  const [cities, setCities] = useState<any[]>([])
  const [suggestions, setsuggestions] = useState<any[]>([])
  const [cityWeather, setCityWeather] = useState<any[]>([])
  const [clicked, setClicked] = useState<boolean>(false)

  // selected city weather result states
  const [description, setDescription] = useState<string>('')
  const [temperature, setTemperature] = useState<string>('')
  const [wind, setWind] = useState<string>('')

  useEffect(() => {
    const loadUsers = async () => {
      let response = [] as any;
      response = City.getAllCities();
      setCities(response);
    }
    loadUsers();
  }, [])

  const loadCityData = async (cityName: string) => {
    let fetchString: string = 'https://goweather.herokuapp.com/weather/' + cityName;
    let response = await (await (fetch(fetchString))).json();
    setDescription(response.description)
    setTemperature(response.temperature)
    setWind(response.wind)
    setCityWeather(response)
  }
  const getCity = (cityName: string) => {
    setClicked(true)
    loadCityData(cityName)
  }

  const onChangeHandler = (text: string) => {
    let matches: any = [];
    if (text.length > 0) {
      setClicked(false)
    }
    if (text.length >= 3) {
      matches = cities.filter(city => {
        const regex = new RegExp(`${text}`, "gi");
        return city.name.match(regex);
      })
      setsuggestions(matches)
    } else {
      setsuggestions([])
    }
  }
  return (
    <section>
      <h1>Weather app</h1>
      <form>
        <input type="text"
          onChange={e => onChangeHandler(e.target.value)} placeholder="Enter city" />
      </form>
      {!clicked
        ? (
          <div className="suggestions">
            {suggestions && suggestions.map((suggestion: { name: string; }, i: number) =>
              <p className="city-to-select" onClick={() => { getCity(suggestion.name) }} key={i} >{suggestion.name}</p>
            )}
          </div>
        )
        : (
          <div className="result">
            <div className="today">
              <div className="today__description">
                <h3>Today</h3>
                <h4>{description && description}</h4>
                <h4>{temperature && "Temperature " + temperature}</h4>
                <h4>{wind && "Wind " + wind}</h4>
              </div>
            </div>
          </div>
        )
      }
    </section>
  );
}

export default App;