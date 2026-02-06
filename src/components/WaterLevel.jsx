import { useEffect, useState } from "react";
import { API_URL, WS_URL } from "../services/api";

const MAX_HEIGHT = 180;
const WARNING_CM = 90;
const CRITICAL_CM = 120;

export default function WaterLevel() {
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState("normal");
  const [lastUpdate, setLastUpdate] = useState("--");

  const percent = Math.min((level / MAX_HEIGHT) * 100, 100);

  useEffect(() => {
    const fetchLatest = async () => {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (!data?.length) return;

      setLevel(parseFloat(data[0].water_level));
      setStatus(data[0].status);
      setLastUpdate(data[0].created_at);
    };

    fetchLatest();
    const i = setInterval(fetchLatest, 30000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (!d.water_level_cm) return;

      setLevel(d.water_level_cm);
      setStatus(d.status);
      setLastUpdate(d.received_at);
    };
    return () => ws.close();
  }, []);

  return (
    <div className="card card-comfortable">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Current Water Level
        </h2>
        <p className="text-sm text-text-secondary">
          Barangay Lingga
        </p>
      </div>

      <div className="relative bg-secondary-50 rounded-md p-4 sm:p-8 mb-6">
        <div className="flex items-end justify-center h-64 sm:h-80">

          {/* SCALE */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 flex flex-col justify-between text-sm text-text-secondary font-data">
            <span>180cm</span>
            <span>150cm</span>
            <span>120cm</span>
            <span>90cm</span>
            <span>60cm</span>
            <span>30cm</span>
            <span>0cm</span>
          </div>

          {/* TANK */}
          <div className="relative w-24 sm:w-32 h-full bg-secondary-200 rounded-md overflow-hidden">

            {/* WATER */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-warning-500 to-warning-400 animate-water-rise transition-all duration-1000"
              style={{ height: `${percent}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
            </div>

            {/* WARNING LINE */}
            <div
              className="absolute left-0 right-0 border-t-2 border-warning-500 border-dashed"
              style={{ top: `${100 - (WARNING_CM / MAX_HEIGHT) * 100}%` }}
            >
              <span className="absolute -right-14 sm:-right-16 -top-3 text-xs text-warning-700 font-medium">
                Warning
              </span>
            </div>

            {/* CRITICAL LINE */}
            <div
              className="absolute left-0 right-0 border-t-2 border-error-500 border-dashed"
              style={{ top: `${100 - (CRITICAL_CM / MAX_HEIGHT) * 100}%` }}
            >
              <span className="absolute -right-16 sm:-right-20 -top-3 text-xs text-error-700 font-medium">
                Critical
              </span>
            </div>
          </div>

          {/* STATUS */}
          <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center gap-2">
              <div className={`status-indicator status-${status} status-pulse w-6 h-6`} />
              <span className="text-xs font-medium uppercase tracking-wide">
                {status}
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className="text-center">
        <p className="data-value text-warning-600 text-4xl sm:text-5xl">
          {level.toFixed(1)} cm
        </p>
        <p className="data-label mt-2">
          Current Water Level
        </p>
        <p className="text-sm text-text-secondary mt-3">
          Last updated: {lastUpdate}
        </p>
      </div>
    </div>
  );
}
