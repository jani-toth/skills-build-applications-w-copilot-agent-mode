import { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchWorkouts() {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
          },
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.detail || 'Unable to load workouts.');
        }

        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
            ? payload.results
            : [];

        if (isMounted) {
          setWorkouts(items);
          setError('');
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message);
          setWorkouts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWorkouts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="data-panel">
      <div className="data-panel-header">
        <div>
          <h2 className="data-panel-title">Workouts</h2>
          <p className="data-panel-subtitle">
            Personalized and suggested workout plans from the REST API.
          </p>
        </div>
        <p className="data-panel-endpoint">Endpoint: {endpoint}</p>
      </div>

      {loading && <p className="data-panel-loading">Loading workouts...</p>}
      {!loading && error && <p className="data-panel-error">{error}</p>}
      {!loading && !error && workouts.length === 0 && (
        <p className="data-panel-empty">No workouts were returned by the API.</p>
      )}

      {!loading && !error && workouts.length > 0 && (
        <div className="data-grid">
          {workouts.map(workout => (
            <article className="card data-card" key={workout.id}>
              <div className="card-body">
                <h3 className="data-card-title">{workout.name}</h3>
                <p className="data-card-text">
                  User: {workout.user?.username || 'Unknown user'}
                </p>
                <p className="data-card-text">
                  Suggested: {workout.suggested ? 'Yes' : 'No'}
                </p>
                <p className="data-card-text">
                  Description: {workout.description || 'No description provided'}
                </p>
                <p className="data-card-text">Created: {workout.created_at}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Workouts;