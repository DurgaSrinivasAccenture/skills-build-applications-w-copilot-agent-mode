import { useEffect, useState } from 'react';
import { getApiEndpoint, fetchData } from '../api';

/**
 * API Endpoints:
 * - https://{CODESPACE_NAME}-8000.app.github.dev/api/workouts (Codespaces)
 * - http://localhost:8000/api/workouts (Local development)
 */
export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newWorkout, setNewWorkout] = useState({
    title: '',
    difficulty: 'Beginner',
    duration: 0,
    focus: '',
  });

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setLoading(true);
        const data = await fetchData(getApiEndpoint('/api/workouts/'));
        setWorkouts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkout.title || !newWorkout.focus) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(getApiEndpoint('/api/workouts/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newWorkout.title,
          difficulty: newWorkout.difficulty,
          duration: parseInt(newWorkout.duration) || 0,
          focus: newWorkout.focus,
        }),
      });
      const addedWorkout = await response.json();
      setWorkouts([...workouts, addedWorkout]);
      setNewWorkout({
        title: '',
        difficulty: 'Beginner',
        duration: 0,
        focus: '',
      });
    } catch (err) {
      alert('Error adding workout: ' + err.message);
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading workouts...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h1>Workouts</h1>
      <form onSubmit={handleAddWorkout} className="mb-4">
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Workout Title"
              value={newWorkout.title}
              onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-control"
              value={newWorkout.difficulty}
              onChange={(e) => setNewWorkout({ ...newWorkout, difficulty: e.target.value })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Duration (min)"
              value={newWorkout.duration}
              onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Focus Area"
              value={newWorkout.focus}
              onChange={(e) => setNewWorkout({ ...newWorkout, focus: e.target.value })}
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
            <th>Title</th>
            <th>Difficulty</th>
            <th>Duration (minutes)</th>
            <th>Focus</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout) => (
            <tr key={workout._id}>
              <td>{workout.title}</td>
              <td>{workout.difficulty}</td>
              <td>{workout.duration}</td>
              <td>{workout.focus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
