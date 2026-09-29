import { useState } from "react";
import { weatherApi } from "../api";
import Banner from "./Banner";

export default function Weather() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await weatherApi.get({ city, state });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="section-heading">
        <h2>Check the weather</h2>
      </div>
      <Banner message={error} />
      <form onSubmit={handleSubmit} className="add-city-form">
        <div className="row">
          <div className="field">
            <label htmlFor="weather-city">City</label>
            <input id="weather-city" value={city} onChange={(event) => setCity(event.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="weather-state">State</label>
            <input id="weather-state" value={state} onChange={(event) => setState(event.target.value)} required />
          </div>
        </div>
        <button className="secondary" type="submit" disabled={loading}>
          {loading ? "Checking..." : "Get weather"}
        </button>
      </form>

      {result && (
        <div className="weather-result">
          <div className="place">
            {result.city}, {result.state} · {result.countryCode}
          </div>
          <div className="temp">{Math.round(result.temperature)}°C</div>
          <div className="condition">{result.weatherCondition || "No condition reported"}</div>
          <div className="weather-stats">
            <div className="stat">
              <div className="value">{result.humidity}%</div>
              <div className="label">Humidity</div>
            </div>
            <div className="stat">
              <div className="value">{result.windSpeed} m/s</div>
              <div className="label">Wind speed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
