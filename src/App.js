import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://warhammer-api-a4bw.onrender.com/api/units")
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Kunde inte hämta units");
        }
        return res.json();
      })
      .then((data) => {
        setUnits(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Kunde inte ladda units. Kontrollera nätet eller cache.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <h1>WARHAMMER 40K UNITS</h1>

      {loading && <p>Laddar units...</p>}

      {!loading && error && <p>{error}</p>}

      {!loading && !error && units.length === 0 && <p>No units found...</p>}

      {!loading && !error && units.length > 0 && (
        <div className="units-grid">
          {units.map((unit) => (
            <div className="unit-card" key={unit._id}>
              <h2>{unit.name}</h2>
              <p>{unit.faction}</p>
              <p>{unit.role}</p>
              <p>{unit.points} pts</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
