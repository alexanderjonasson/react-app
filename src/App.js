import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offlineMessage, setOfflineMessage] = useState("");

  useEffect(() => {
    fetch("https://warhammer-api-a4bw.onrender.com/api/units")
      .then((res) => res.json())
      .then((data) => {
        setUnits(data);
        localStorage.setItem("warhammer_units", JSON.stringify(data));
        setOfflineMessage("");
      })
      .catch((err) => {
        console.error("Fetch failed, trying localStorage cache:", err);

        const cachedUnits = localStorage.getItem("warhammer_units");

        if (cachedUnits) {
          setUnits(JSON.parse(cachedUnits));
          setOfflineMessage("Visar senast sparade units (offline-läge).");
        } else {
          setOfflineMessage(
            "Kunde inte ladda units och ingen sparad cache finns.",
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <h1>WARHAMMER 40K UNITS</h1>

      {loading && <p>Laddar units...</p>}

      {!loading && offlineMessage && <p>{offlineMessage}</p>}

      {!loading && units.length > 0 && (
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

      {!loading && units.length === 0 && !offlineMessage && (
        <p>No units found...</p>
      )}
    </div>
  );
}

export default App;
