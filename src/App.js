import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/units")
      .then((res) => res.json())
      .then((data) => setUnits(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>Warhammer 40K Units</h1>

      {units.length === 0 ? (
        <p>No units found...</p>
      ) : (
        <ul>
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
      )}
    </div>
  );
}

export default App;
