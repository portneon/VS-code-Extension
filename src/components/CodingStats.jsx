import React, { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API = "http://localhost:5070";

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function CodingStats({ darkMode }) {
  const [totalTimeSec, setTotalTimeSec] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [activeTimeSec, setActiveTimeSec] = useState(0);
  const [error, setError] = useState("");

  const timerRef = useRef(null);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/stats`);
      const data = await res.json();

      const match = data.totalTime.match(/(\d+) hr (\d+) min (\d+) sec/);
      if (match) {
        const h = parseInt(match[1]);
        const m = parseInt(match[2]);
        const s = parseInt(match[3]);
        setTotalTimeSec(h * 3600 + m * 60 + s);
      }
      setTotalSessions(data.totalSessions);
    } catch (error) {
      setError(`Failed to fetch stats : ${error}`);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API}/sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (e) {
      setError("Failed to fetch sessions");
    }
  };

  const handleStart = async () => {
    try {
      setError("");
      const res = await fetch(`${API}/start`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to start session");
        return;
      }
      const data = await res.json();
      setActiveSession({ startTime: data.startTime });
      setActiveTimeSec(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setActiveTimeSec((t) => t + 1);
      }, 1000);
    } catch (e) {
      setError("Failed to start session: ", e);
    }
  };

  const handleStop = async () => {
    try {
      setError("");
      const res = await fetch(`${API}/stop`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to stop session");
        return;
      }
      const data = await res.json();

      setActiveSession(null);
      setActiveTimeSec(0);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await fetchStats();
      await fetchSessions();
    } catch (e) {
      setError("Failed to stop session");
      console.error(e);
    }
  };

  useEffect(() => {
    const checkSessionStatus = async () => {
      try {
        const res = await fetch(`${API}/session-status`);
        const data = await res.json();
        if (data.active && data.startTime) {
          setActiveSession({ startTime: data.startTime });
          const start = new Date(data.startTime);
          const now = new Date();
          setActiveTimeSec(Math.floor((now - start) / 1000));
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setActiveTimeSec((t) => t + 1);
          }, 1000);
        } else {
          setActiveSession(null);
          setActiveTimeSec(0);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      } catch (e) {}
    };
    checkSessionStatus();
    fetchStats();
    fetchSessions();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const weeklyData = React.useMemo(() => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayHours = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    sessions.forEach((session) => {
      const d = new Date(session.startTime);
      const dayName = dayNames[d.getDay()];
      const match = session.duration.match(/(\d+) hr (\d+) min (\d+) sec/);
      if (match) {
        const h = parseInt(match[1]);
        const m = parseInt(match[2]);
        const s = parseInt(match[3]);
        const hours = h + m / 60 + s / 3600;
        dayHours[dayName] += hours;
      }
    });

    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      hours: Number(dayHours[day].toFixed(2)),
    }));
  }, [sessions]);

  const containerStyle = {
    marginTop: "40px",
    padding: "25px",
    backgroundColor: "rgba(106, 76, 139, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 25px rgba(90, 54, 112, 0.15)",
    maxWidth: 900,
    marginLeft: "auto",
    marginRight: "auto",
  };

  const cardStyle = {
    backgroundColor: darkMode ? "#2e2e2e" : "#68338a",
    borderRadius: "12px",
    padding: "24px 20px 20px 20px",
    marginBottom: "24px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const headingStyle = {
    fontSize: "24px",
    marginBottom: "18px",
    color: "#e0b3ff",
    textAlign: "center",
    borderBottom: "2px solid rgba(255,255,255,0.15)",
    paddingBottom: "10px",
    fontWeight: 700,
  };

  const buttonStyle = {
    backgroundColor: "#68338a",
    color: "white",
    border: "none",
    padding: "16px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    marginTop: "16px",
    marginRight: "10px",
  };

  const chartContainerStyle = {
    backgroundColor: "#2a2a2a",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 4px 10px rgba(90, 54, 112, 0.10)",
  };

  const sessionsListStyle = {
    maxHeight: 150,
    overflowY: "auto",
    marginTop: 10,
    backgroundColor: "#2e2e2e",
    borderRadius: 8,
    padding: 10,
    color: "#e6edf3",
  };

  const sessionItemStyle = {
    padding: "6px 0",
    borderBottom: "1px solid #68338a",
  };

  const errorStyle = {
    background: "#ff5252",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 16px",
    marginBottom: 16,
    textAlign: "center",
    fontWeight: 600,
  };
  const durationStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
  };

  return (
    <div>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Total Coding Time</h2>
        <p style={durationStyle}>{formatTime(totalTimeSec)}</p>
        <p>Total Sessions: {totalSessions}</p>
        {activeSession ? (
          <button style={buttonStyle} onClick={handleStop}>
            Stop Session (Active: {formatTime(activeTimeSec)})
          </button>
        ) : (
          <button style={buttonStyle} onClick={handleStart}>
            Start Session
          </button>
        )}
      </div>
      <div style={chartContainerStyle}>
        <h2 style={headingStyle}>Weekly Coding Stats</h2>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid stroke="#a99fd1" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#e0d9f2" />
              <YAxis stroke="#e0d9f2" />
              <Tooltip
                contentStyle={{ backgroundColor: "#68338a", borderRadius: 5 }}
                itemStyle={{ color: "#e0d9f2" }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#b292d6"
                strokeWidth={3}
                dot={{ fill: "#b292d6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Past Sessions</h2>
        <div style={sessionsListStyle}>
          {sessions.length === 0 && <p>No sessions recorded yet.</p>}
          {sessions
            .slice(-5)
            .reverse()
            .map((s) => (
              <div key={s.id} style={sessionItemStyle}>
                <strong>Session {s.id}:</strong>{" "}
                {new Date(s.startTime).toLocaleString()} — {s.duration}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export default CodingStats;
