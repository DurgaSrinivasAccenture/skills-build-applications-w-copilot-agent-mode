import { useEffect, useState } from 'react';
import { getApiEndpoint, fetchData } from '../api';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTeam, setNewTeam] = useState({ name: '', members: '', points: 0 });

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        const data = await fetchData(getApiEndpoint('/api/teams/'));
        setTeams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name) {
      alert('Please enter a team name');
      return;
    }

    try {
      const members = newTeam.members ? newTeam.members.split(',').map((m) => m.trim()) : [];
      const response = await fetch(getApiEndpoint('/api/teams/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeam.name,
          members,
          points: parseInt(newTeam.points) || 0,
        }),
      });
      const addedTeam = await response.json();
      setTeams([...teams, addedTeam]);
      setNewTeam({ name: '', members: '', points: 0 });
    } catch (err) {
      alert('Error adding team: ' + err.message);
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading teams...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h1>Teams</h1>
      <form onSubmit={handleAddTeam} className="mb-4">
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Team Name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Members (comma-separated)"
              value={newTeam.members}
              onChange={(e) => setNewTeam({ ...newTeam, members: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Points"
              value={newTeam.points}
              onChange={(e) => setNewTeam({ ...newTeam, points: e.target.value })}
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
            <th>Team Name</th>
            <th>Members</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team._id}>
              <td>{team.name}</td>
              <td>{team.members?.join(', ') || 'No members'}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
