import React, { useState } from "react";
// import { ICountry, IState, ICity } from 'country-state-city'
import { Country, State, City }  from 'country-state-city';

console.log(City.getAllCities());
export interface Props {
  
}
 
const App: React.FC<Props> = () => {
  const [cities, setCities] = useState([])
  return (<section>
    
  </section>);
}
 
export default App;