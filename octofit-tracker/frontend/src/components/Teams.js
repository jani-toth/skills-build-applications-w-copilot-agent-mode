import { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchTeams() {
      console.log('Teams endpoint:', endpoint);

      try {
        const response = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
          },
        });
        const payload = await response.json();

        console.log('Teams fetched data:', payload);

        if (!response.ok) {
          throw new Error(payload.detail || 'Unable to load teams.');
        }

        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
            ? payload.results
            : [];

        if (isMounted) {
          setTeams(items);
          setError('');
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message);
          setTeams([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="data-panel">
      <div className="data-panel-header">
        <div>
          <h2 className="data-panel-title">Teams</h2>
          <p className="data-panel-subtitle">
            Team records and member lists from the backend API.
          </p>
        </div>
        <p className="data-panel-endpoint">Endpoint: {endpoint}</p>
      </div>

      {loading && <p className="data-panel-loading">Loading teams...</p>}
      {!loading && error && <p className="data-panel-error">{error}</p>}
      {!loading && !error && teams.length === 0 && (
        <p className="data-panel-empty">No teams were returned by the API.</p>
      )}

      {!loading && !error && teams.length > 0 && (
        <div className="data-grid">
          {teams.map(team => (
            <article className="card data-card" key={team.id}>
              <div className="card-body">
                <h3 className="data-card-title">{team.name}</h3>
                <p className="data-card-text">Created: {team.created_at || 'Unknown'}</p>
                <p className="data-card-text">
                  Members: {Array.isArray(team.members) ? team.members.length : 0}
                </p>
                <p className="data-card-text">
                  {Array.isArray(team.members) && team.members.length > 0
                    ? team.members.map(member => member.username).join(', ')
                    : 'No members listed'}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Teams;