import { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchLeaderboard() {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
          },
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.detail || 'Unable to load leaderboard data.');
        }

        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
            ? payload.results
            : [];

        if (isMounted) {
          setEntries(items);
          setError('');
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message);
          setEntries([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="data-panel">
      <div className="data-panel-header">
        <div>
          <h2 className="data-panel-title">Leaderboard</h2>
          <p className="data-panel-subtitle">
            Competitive rankings served by the Django REST framework backend.
          </p>
        </div>
        <p className="data-panel-endpoint">Endpoint: {endpoint}</p>
      </div>

      {loading && <p className="data-panel-loading">Loading leaderboard...</p>}
      {!loading && error && <p className="data-panel-error">{error}</p>}
      {!loading && !error && entries.length === 0 && (
        <p className="data-panel-empty">No leaderboard entries were returned by the API.</p>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="data-grid">
          {entries.map(entry => (
            <article className="card data-card" key={entry.id}>
              <div className="card-body">
                <h3 className="data-card-title">Rank #{entry.rank}</h3>
                <p className="data-card-text">
                  User: {entry.user?.username || 'Unknown user'}
                </p>
                <p className="data-card-text">
                  Team: {entry.team?.name || 'No team assigned'}
                </p>
                <p className="data-card-text">Score: {entry.score}</p>
                <p className="data-card-text">Period: {entry.period}</p>
                <p className="data-card-text">Updated: {entry.updated_at}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Leaderboard;