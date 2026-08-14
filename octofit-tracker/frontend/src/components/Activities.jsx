import { useEffect, useState } from 'react';
import { getApiEndpoint, fetchData } from '../api';

/**
 * API Endpoints:
 * - https://{CODESPACE_NAME}-8000.app.github.dev/api/activities (Codespaces)
 * - http://localhost:8000/api/activities (Local development)
 */
export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newActivity, setNewActivity] = useState({ user: '', type: '', minutes: 0, date: '' });

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await fetchData(getApiEndpoint('/api/activities/'));
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.user || !newActivity.type || !newActivity.date) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(getApiEndpoint('/api/activities/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: newActivity.user,
          type: newActivity.type,
          minutes: parseInt(newActivity.minutes) || 0,
          date: newActivity.date,
        }),
      });
      const addedActivity = await response.json();
      setActivities([...activities, addedActivity]);
      setNewActivity({ user: '', type: '', minutes: 0, date: '' });
    } catch (err) {
      alert('Error adding activity: ' + err.message);
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading activities...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h1>Activities</h1>
      <form onSubmit={handleAddActivity} className="mb-4">
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="User Name"
              value={newActivity.user}
              onChange={(e) => setNewActivity({ ...newActivity, user: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Activity Type"
              value={newActivity.type}
              onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Minutes"
              value={newActivity.minutes}
              onChange={(e) => setNewActivity({ ...newActivity, minutes: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={newActivity.date}
              onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
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
            <th>User</th>
            <th>Activity Type</th>
            <th>Minutes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity._id}>
              <td>{activity.user}</td>
              <td>{activity.type}</td>
              <td>{activity.minutes}</td>
              <td>{activity.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
