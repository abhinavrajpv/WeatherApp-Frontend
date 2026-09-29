import { useState } from "react";
import { cityApi } from "../api";
import Banner from "./Banner";

export default function AddCityForm({ onCityAdded }) {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const created = await cityApi.add({ city, state, countryCode });
      onCityAdded(created);
      setCity("");
      setState("");
      setCountryCode("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="add-city-form">
      <Banner message={error} />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="field">
            <label htmlFor="add-city">City</label>
            <input id="add-city" value={city} onChange={(event) => setCity(event.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="add-state">State</label>
            <input id="add-state" value={state} onChange={(event) => setState(event.target.value)} required />
          </div>
          <div className="field" style={{ maxWidth: 110 }}>
            <label htmlFor="add-country">Country</label>
            <input
              id="add-country"
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              placeholder="IN"
              maxLength={2}
              required
            />
          </div>
        </div>
        <button className="secondary" type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add city"}
        </button>
      </form>
    </div>
  );
}
