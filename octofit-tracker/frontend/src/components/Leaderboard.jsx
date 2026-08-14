import { useEffect, useState } from 'react';
import { getApiEndpoint, fetchData } from '../api';

/**
 * API Endpoints:
 * - https://{CODESPACE_NAME}-8000.app.github.dev/api/leaderboard (Codespaces)
 * - http://localhost:8000/api/leaderboard (Local development)
 */
export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEntry, setNewEntry] = useState({ name: '', team: '', points: 0 });

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await fetchData(getApiEndpoint('/api/leaderboard/'));
        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.name || !newEntry.team) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(getApiEndpoint('/api/leaderboard/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newEntry.name,
          team: newEntry.team,
          points: parseInt(newEntry.points) || 0,
        }),
      });
      const addedEntry = await response.json();
      setLeaderboard([...leaderboard, addedEntry]);
      setNewEntry({ name: '', team: '', points: 0 });
    } catch (err) {
      alert('Error adding leaderboard entry: ' + err.message);
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h1>Leaderboard</h1>
      <form onSubmit={handleAddEntry} className="mb-4">
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Athlete Name"
              value={newEntry.name}
              onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Team"
              value={newEntry.team}
              onChange={(e) => setNewEntry({ ...newEntry, team: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Points"
              value={newEntry.points}
              onChange={(e) => setNewEntry({ ...newEntry, points: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Add</button>
          </div>
        </div>
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Athlete</th>
            <th>Team</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry._id}>
              <td>{index + 1}</td>
              <td>{entry.name}</td>
              <td>{entry.team}</td>
              <td>{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
