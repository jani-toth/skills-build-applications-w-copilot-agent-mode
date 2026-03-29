import { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchActivities() {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
          },
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.detail || 'Unable to load activities.');
        }

        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
            ? payload.results
            : [];

        if (isMounted) {
          setActivities(items);
          setError('');
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message);
          setActivities([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="data-panel">
      <div className="data-panel-header">
        <div>
          <h2 className="data-panel-title">Activities</h2>
          <p className="data-panel-subtitle">
            Logged activity events from the Django REST backend.
          </p>
        </div>
        <p className="data-panel-endpoint">Endpoint: {endpoint}</p>
      </div>

      {loading && <p className="data-panel-loading">Loading activities...</p>}
      {!loading && error && <p className="data-panel-error">{error}</p>}
      {!loading && !error && activities.length === 0 && (
        <p className="data-panel-empty">No activities were returned by the API.</p>
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="data-grid">
          {activities.map(activity => (
            <article className="card data-card" key={activity.id}>
              <div className="card-body">
                <h3 className="data-card-title">{activity.type}</h3>
                <p className="data-card-text">
                  User: {activity.user?.username || 'Unknown user'}
                </p>
                <p className="data-card-text">
                  Team: {activity.team?.name || 'No team assigned'}
                </p>
                <p className="data-card-text">Duration: {activity.duration} min</p>
                <p className="data-card-text">
                  Distance: {activity.distance ?? 'Not tracked'} km
                </p>
                <p className="data-card-text">
                  Calories: {activity.calories ?? 'Not tracked'}
                </p>
                <p className="data-card-text">Date: {activity.date}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Activities;