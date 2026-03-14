import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetch("https://warhammer-api-a4bw.onrender.com/api/units")
      .then((res) => res.json())
      .then((data) => setUnits(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>WARHAMMER 40K UNITS</h1>

      {units.length === 0 ?
        <p>Laddar units...</p>
      : <ul>
          {units.map((unit) => (
            <li key={unit._id}>
              <strong>{unit.name}</strong>
              <div>{unit.faction}</div>
              <div>{unit.role}</div>
              <div>
                <span>{unit.points} pts</span>
              </div>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}

export default App;
