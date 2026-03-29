import { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      console.log('Users endpoint:', endpoint);

      try {
        const response = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
          },
        });
        const payload = await response.json();

        console.log('Users fetched data:', payload);

        if (!response.ok) {
          throw new Error(payload.detail || 'Unable to load users.');
        }

        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
            ? payload.results
            : [];

        if (isMounted) {
          setUsers(items);
          setError('');
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message);
          setUsers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="data-panel">
      <div className="data-panel-header">
        <div>
          <h2 className="data-panel-title">Users</h2>
          <p className="data-panel-subtitle">
            Accounts and profile data served by the Django REST API.
          </p>
        </div>
        <p className="data-panel-endpoint">Endpoint: {endpoint}</p>
      </div>

      {loading && <p className="data-panel-loading">Loading users...</p>}
      {!loading && error && <p className="data-panel-error">{error}</p>}
      {!loading && !error && users.length === 0 && (
        <p className="data-panel-empty">No users were returned by the API.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="data-grid">
          {users.map(user => (
            <article className="card data-card" key={user.id}>
              <div className="card-body">
                <h3 className="data-card-title">{user.username}</h3>
                <p className="data-card-text">Email: {user.email || 'Not provided'}</p>
                <p className="data-card-text">
                  Name: {[user.first_name, user.last_name].filter(Boolean).join(' ') || 'Not provided'}
                </p>
                <p className="data-card-text">User ID: {user.id}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Users;