import { useEffect, useState } from "react";
import { cityApi } from "../api";
import AddCityForm from "./AddCityForm";
import Banner from "./Banner";

export default function Cities({ role }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCities();
  }, []);

  async function loadCities() {
    setLoading(true);
    setError("");
    try {
      const data = await cityApi.list();
      setCities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCityAdded(created) {
    setCities((current) => [...current, created]);
  }

  async function handleDelete(id) {
    setError("");
    try {
      await cityApi.remove(id);
      setCities((current) => current.filter((city) => city.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      {role === "ADMIN" && (<AddCityForm onCityAdded={handleCityAdded} />)}
      <div className="section-heading">
        <h2>Saved cities</h2>
      </div>
      <Banner message={error} />
      {loading ? (
        <p className="empty">Loading cities...</p>
      ) : cities.length === 0 ? (
        <p className="empty">No cities saved yet. Add one above to get started.</p>
      ) : (
        cities.map((city) => (
          <div className="city-card" key={city.id}>
            <div>
              <div className="name">
                {city.city}, {city.state}
              </div>
              <div className="meta">{city.countryCode}</div>
            </div>
            {role === "ADMIN" && (
                <div className="actions">
                <button
                className="danger"
                 onClick={() => handleDelete(city.id)}
                  >
                    Remove
                    </button>
                       </div>
                         )}
          </div>
        ))
      )}
    </div>
  );
}
