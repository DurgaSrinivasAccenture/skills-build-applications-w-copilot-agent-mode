import { useEffect, useState } from 'react';
import { getApiEndpoint, fetchData } from '../api';

/**
 * API Endpoints:
 * - https://{CODESPACE_NAME}-8000.app.github.dev/api/users (Codespaces)
 * - http://localhost:8000/api/users (Local development)
 */
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', team: '' });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchData(getApiEndpoint('/api/users/'));
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.team) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(getApiEndpoint('/api/users/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const addedUser = await response.json();
      setUsers([...users, addedUser]);
      setNewUser({ name: '', email: '', team: '' });
    } catch (err) {
      alert('Error adding user: ' + err.message);
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading users...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h1>Users</h1>
      <form onSubmit={handleAddUser} className="mb-4">
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Team"
              value={newUser.team}
              onChange={(e) => setNewUser({ ...newUser, team: e.target.value })}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </div>
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
