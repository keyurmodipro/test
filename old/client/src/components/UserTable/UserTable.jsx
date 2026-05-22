import { useState, useEffect, useRef, useCallback } from 'react';
import { getUsers } from '../../api/userApi';
import './UserTable.css';

const UserTable = ({ refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef(null);

  const fetchUsers = useCallback(async (searchTerm = '') => {
    setLoading(true);
    try {
      const response = await getUsers(searchTerm);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when refreshTrigger changes
  useEffect(() => {
    fetchUsers(search);
  }, [refreshTrigger]);

  // Debounced search
  const handleSearch = (value) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(value), 300);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const getInitials = (first, last) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="user-table-card">
      <div className="table-header">
        <div className="table-title-section">
          <div className="table-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <div>
            <h2>
              User Profiles
              <span className="record-count">{users.length} records</span>
            </h2>
            <p>Browse and search all registered users</p>
          </div>
        </div>

        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="search-users"
            type="text"
            className="search-input"
            placeholder="Search by first or last name..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="table-container">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-cell" />
              <div className="skeleton-cell" />
              <div className="skeleton-cell" />
              <div className="skeleton-cell" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3>{search ? 'No matches found' : 'No users yet'}</h3>
          <p>{search ? 'Try adjusting your search term' : 'Create your first user profile above'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-name">
                      <div className="user-avatar">{getInitials(user.firstName, user.lastName)}</div>
                      <span className="user-name-text">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td>{formatDate(user.dateOfBirth)}</td>
                  <td><span className="email-link">{user.email}</span></td>
                  <td>
                    <span className="location-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {user.city}, {user.country}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
