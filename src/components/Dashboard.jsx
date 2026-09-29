import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Cities from "./Cities";
import Weather from "./Weather";

export default function Dashboard() {
  const { username, role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("cities");

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          Weather <span>Station</span>
        </div>
        <div className="who">
          <span>{username}</span>
          <button className="link-button" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === "cities" ? "active" : ""}`}
          onClick={() => setActiveTab("cities")}
        >
          Cities
        </button>
        <button
          className={`tab ${activeTab === "weather" ? "active" : ""}`}
          onClick={() => setActiveTab("weather")}
        >
          Weather
        </button>
      </nav>

      <main className="content">{activeTab === "cities" ? (<Cities role={role} />) : (<Weather />)}</main>
    </div>
  );
}
