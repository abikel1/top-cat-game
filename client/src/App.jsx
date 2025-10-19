import { useEffect, useState } from "react";
import "./App.css";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";

const API_BASE = "http://localhost:4000";

export default function App() {
  const [users, setUsers] = useState([]);     // ה־Top N לרשימה
  const [bottom3, setBottom3] = useState([]); // שלושת הנמוכים לכרטיסים
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // טוען את ה-Top N לרשימה (ברירת מחדל 10)
  const loadTop = async () => {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`${API_BASE}/api/users/top?limit=10`);
      const data = await r.json();
      if (Array.isArray(data)) setUsers(data);
      else setErr(data?.error || "Failed to load leaderboard");
    } catch (e) {
      setErr(String(e.message));
    } finally {
      setLoading(false);
    }
  };

  // טוען את שלושת הנמוכים לכרטיסים
  const loadBottom3 = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/users/bottom?limit=3`);
      const data = await r.json();
      if (Array.isArray(data)) setBottom3(data);
    } catch {
      /* לא קריטי לרוץ את הדף אם אין */
    }
  };

  useEffect(() => {
    loadTop();
    loadBottom3();
  }, []);

  // חישוב דרגת המשתמש בכרטיסים (האינדקס של הכרטיס + מיקום מהרשימה הכוללת)
  const rankLabel = (indexInBottom) => {
    // אם אין users עדיין, נציג רק "Rank"
    if (!users.length) return `Rank`;
    // המיקום של שלושת האחרונים ביחס למספר הכולל (last 3)
    const lastRankStart = users.length - bottom3.length + 1; // לדוגמה: 8 משתמשים -> 8-3+1 = 6
    return `Rank: #${lastRankStart + indexInBottom}`;
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: 3, paddingBottom: 6 }}>
      {/* כותרת */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 900, color: "#6a0dad" }}
      >
        🐱 Top Cats Leaderboard
      </Typography>

      {/* שלושת המשתמשים בתחתית הדירוג */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        {bottom3.map((u, i) => (
          <Grid item xs={12} sm={4} key={u.id}>
            <Paper elevation={4} className="top-card">
              <Avatar
                src={u.image_url || "https://via.placeholder.com/70"}
                alt={u.name}
                sx={{ width: 70, height: 70, mx: "auto", mb: 1 }}
              />
              <Typography className="name">{u.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {rankLabel(i)}
              </Typography>
              <Typography className="score" sx={{ mt: 1 }}>
                Score: {u.score}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* רשימת ה-Top */}
      <div className="leaderboard">
        {loading ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <CircularProgress color="secondary" />
          </div>
        ) : err ? (
          <div className="empty error">Error: {err}</div>
        ) : users.length === 0 ? (
          <div className="empty">No users yet.</div>
        ) : (
          users.map((u, i) => (
            <div key={u.id} className="leaderboard-item">
              <span className="rank">#{i + 1}</span>
              <img
                src={u.image_url || "https://via.placeholder.com/50"}
                alt={u.name}
              />
              <h4>{u.name}</h4>
              <p>{u.score}</p>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
