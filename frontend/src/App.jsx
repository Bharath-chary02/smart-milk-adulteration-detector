import { useState, useEffect } from "react";
import axios from "axios";

// ===== API BASE URL =====
// Use this when running locally:
// const API = "http://192.168.43.122:3000";

// Use this when deployed on Vercel (point to Render backend):
const API = "https://milk-backend-ghny.onrender.com";

const SAMPLE_DATA = [
  { _id: "1", ph: 6.45, temperature: 29.3, conductivity: 412.5, result: "Pure", confidence: 96.33, timestamp: "2026-04-26T08:00:00Z" },
  { _id: "2", ph: 6.63, temperature: 30.1, conductivity: 498.7, result: "Pure", confidence: 93.12, timestamp: "2026-04-26T08:30:00Z" },
  { _id: "3", ph: 6.71, temperature: 28.5, conductivity: 532.1, result: "Pure", confidence: 91.87, timestamp: "2026-04-26T09:00:00Z" },
  { _id: "4", ph: 7.08, temperature: 31.2, conductivity: 278.4, result: "Watered", confidence: 89.45, timestamp: "2026-04-26T09:30:00Z" },
  { _id: "5", ph: 6.92, temperature: 27.9, conductivity: 301.6, result: "Watered", confidence: 86.23, timestamp: "2026-04-26T10:00:00Z" },
  { _id: "6", ph: 8.45, temperature: 29.8, conductivity: 1245.3, result: "Detergent", confidence: 98.76, timestamp: "2026-04-26T10:30:00Z" },
  { _id: "7", ph: 7.95, temperature: 30.4, conductivity: 876.2, result: "Detergent", confidence: 94.32, timestamp: "2026-04-26T11:00:00Z" },
  { _id: "8", ph: 7.15, temperature: 28.7, conductivity: 645.8, result: "Urea", confidence: 88.91, timestamp: "2026-04-26T11:30:00Z" },
  { _id: "9", ph: 6.98, temperature: 31.5, conductivity: 698.4, result: "Urea", confidence: 85.67, timestamp: "2026-04-26T12:00:00Z" },
  { _id: "10", ph: 6.55, temperature: 29.6, conductivity: 476.3, result: "Pure", confidence: 95.44, timestamp: "2026-04-26T12:30:00Z" },
];

function getResultColor(result) {
  if (result === "Pure") return "#22c55e";
  if (result === "Milk") return "#22c55e";
  if (result === "Adulterated") return "#ef4444";
  if (result === "Detergent") return "#f97316";
  if (result === "Urea") return "#a855f7";
  if (result === "Water") return "#3b82f6";
  if (result === "Watered") return "#06b6d4";
  return "#6b7280";
}

export default function App() {
  const [readings, setReadings] = useState(SAMPLE_DATA);
  const [latest, setLatest] = useState(SAMPLE_DATA[0]);

  const fetchReadings = async () => {
    try {
      const res = await axios.get(`${API}/api/readings`);
      if (res.data && res.data.length > 0) {
        setReadings(res.data);
        setLatest(res.data[0]);
      }
    } catch (err) {
      console.error("Using sample data:", err);
    }
  };

  useEffect(() => {
    fetchReadings();
    const interval = setInterval(fetchReadings, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", background: "#f1f5f9", minHeight: "100vh" }}>

      <h1 style={{ textAlign: "center", color: "#1e293b" }}>
        🥛 Milk Analyser Dashboard
      </h1>

      {/* Sample Data Banner */}
      <div style={{
        background: "#fef9c3",
        border: "1px solid #fbbf24",
        borderRadius: "8px",
        padding: "12px 20px",
        marginBottom: "20px",
        textAlign: "center",
        color: "#92400e"
      }}>
        ⚠️ <strong>Note:</strong> The readings displayed here are sample data for demonstration purposes.
        To view live real-time readings, the IoT hardware setup (Arduino UNO + sensors) must be connected and running on the local network.
      </div>

      {latest && (
        <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h2 style={{ color: "#475569", marginBottom: "16px" }}>
            Latest Reading
          </h2>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>

            {/* pH */}
            <div style={{ flex: 1, background: "#f8fafc", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#3b82f6" }}>
                {latest.ph.toFixed(2)}
              </div>
              <div style={{ color: "#64748b" }}>pH Level</div>
            </div>

            {/* Temperature */}
            <div style={{ flex: 1, background: "#f8fafc", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f97316" }}>
                {latest.temperature.toFixed(1)}°C
              </div>
              <div style={{ color: "#64748b" }}>Temperature</div>
            </div>

            {/* Conductivity */}
            <div style={{ flex: 1, background: "#f8fafc", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#8b5cf6" }}>
                {latest.conductivity.toFixed(1)}
              </div>
              <div style={{ color: "#64748b" }}>Conductivity (µS)</div>
            </div>

            {/* Result */}
            <div style={{ flex: 1, background: "#f8fafc", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: getResultColor(latest.result) }}>
                {latest.result}
              </div>
              <div style={{ color: "#64748b" }}>Result</div>
              <div style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}>
                {latest.confidence}% confidence
              </div>
            </div>

          </div>

          <div style={{ marginTop: "12px", color: "#94a3b8", fontSize: "13px", textAlign: "right" }}>
            Last updated: {new Date(latest.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {/* History Table */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#475569", marginBottom: "16px" }}>
          Reading History
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "10px", textAlign: "left", color: "#64748b" }}>Time</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#64748b" }}>pH</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#64748b" }}>Temp (°C)</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#64748b" }}>Conductivity</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#64748b" }}>Result</th>
              <th style={{ padding: "10px", textAlign: "left", color: "#64748b" }}>Confidence</th>
            </tr>
          </thead>

          <tbody>
            {readings.map((r) => (
              <tr key={r._id} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px", color: "#475569", fontSize: "13px" }}>
                  {new Date(r.timestamp).toLocaleString()}
                </td>
                <td style={{ padding: "10px" }}>{r.ph.toFixed(2)}</td>
                <td style={{ padding: "10px" }}>{r.temperature.toFixed(1)}</td>
                <td style={{ padding: "10px" }}>{r.conductivity.toFixed(1)}</td>

                <td style={{ padding: "10px" }}>
                  <span style={{
                    background: getResultColor(r.result),
                    color: "white",
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "13px",
                  }}>
                    {r.result}
                  </span>
                </td>

                <td style={{ padding: "10px", color: "#64748b" }}>
                  {r.confidence}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}