import { useEffect, useState } from "react";
import { API_BASE } from "../services/api";

export default function WaterLevel() {
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState("normal");
  const [updatedAt, setUpdatedAt] = useState("");

  // Initial fetch
  useEffect(() => {
    fetch(`${API_BASE}/api/sensors/latest`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length) {
          setLevel(Number(data[0].water_level));
          setStatus(data[0].status);
          setUpdatedAt(data[0].created_at);
        }
      })
      .catch(console.error);
  }, []);

  // Realtime WebSocket
  useEffect(() => {
    const ws = new WebSocket("wss://watersense-backend.onrender.com");

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (!data.water_level_cm) return;

      setLevel(Number(data.water_level_cm));
      setStatus(data.status);
      setUpdatedAt(data.received_at);
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>{level.toFixed(1)} cm</h2>
      <p>Status: {status}</p>
      <small>Last updated: {updatedAt}</small>
    </div>
  );
}
