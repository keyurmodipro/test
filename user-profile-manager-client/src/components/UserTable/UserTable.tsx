import { useState, useEffect, useRef, useCallback } from 'react';
import { getUsers } from '../../api/userApi';
import type { User } from '../../types';

interface UserTableProps {
  refreshTrigger: number;
}

const UserTable: React.FC<UserTableProps> = ({ refreshTrigger }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback(async (searchTerm: string = '') => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Debounced search
  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(value), 300);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const getInitials = (first: string, last: string): string => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  // Row animation delay styles
  const getRowDelay = (index: number): string => {
    const delays = ['0.02s', '0.04s', '0.06s', '0.08s', '0.10s'];
    return delays[index] || '0.10s';
  };

  return (
    <div className="bg-surface border border-border rounded-[20px] p-9 shadow-lg max-md:p-6 max-md:rounded-2xl">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-7 gap-5 flex-wrap max-md:flex-col max-md:items-stretch">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-[0_4px_12px_var(--color-indigo-glow)]">
            <svg className="w-[22px] h-[22px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <div>
            <h2 className="text-[1.3rem] font-bold text-text-primary tracking-[-0.02em]">
              User Profiles
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[rgba(99,102,241,0.1)] rounded-lg text-[0.78rem] font-semibold text-indigo-light ml-2.5">
                {users.length} records
              </span>
            </h2>
            <p className="text-[0.85rem] text-text-muted mt-0.5">Browse and search all registered users</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px] max-md:min-w-0">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted pointer-events-none"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="search-users"
            type="text"
            className="
              w-full py-3 pl-11 pr-4 border-2 border-border rounded-xl bg-input-bg
              text-text-primary text-[0.9rem] font-sans transition-all duration-300 outline-none
              placeholder:text-text-muted
              focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-glow)]
            "
            placeholder="Search by first or last name..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="overflow-x-auto rounded-[14px] border border-border">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-5 px-5 py-4 border-b border-border">
              <div className="h-4 w-1/4 bg-gradient-to-r from-border via-card-bg to-border bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-lg" />
              <div className="h-4 w-[15%] bg-gradient-to-r from-border via-card-bg to-border bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-lg" />
              <div className="h-4 w-[30%] bg-gradient-to-r from-border via-card-bg to-border bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-lg" />
              <div className="h-4 w-1/5 bg-gradient-to-r from-border via-card-bg to-border bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-lg" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-[60px] px-5">
          <div className="w-[72px] h-[72px] mx-auto mb-5 bg-card-bg rounded-[20px] flex items-center justify-center border border-border">
            <svg className="w-8 h-8 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-[1.1rem] text-text-primary mb-2">
            {search ? 'No matches found' : 'No users yet'}
          </h3>
          <p className="text-[0.9rem] text-text-muted">
            {search ? 'Try adjusting your search term' : 'Create your first user profile above'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[14px] border border-border">
          <table className="w-full border-collapse text-[0.9rem]">
            <thead className="bg-card-bg">
              <tr>
                <th className="px-5 py-3.5 text-left text-[0.78rem] font-bold text-text-muted uppercase tracking-[0.06em] border-b border-border whitespace-nowrap">Name</th>
                <th className="px-5 py-3.5 text-left text-[0.78rem] font-bold text-text-muted uppercase tracking-[0.06em] border-b border-border whitespace-nowrap">Date of Birth</th>
                <th className="px-5 py-3.5 text-left text-[0.78rem] font-bold text-text-muted uppercase tracking-[0.06em] border-b border-border whitespace-nowrap">Email</th>
                <th className="px-5 py-3.5 text-left text-[0.78rem] font-bold text-text-muted uppercase tracking-[0.06em] border-b border-border whitespace-nowrap">Location</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="transition-colors duration-200 hover:bg-[rgba(20,184,166,0.04)] animate-[fadeInRow_0.3s_ease_both] last:*:border-b-0"
                  style={{ animationDelay: getRowDelay(index) }}
                >
                  <td className="px-5 py-4 text-text-secondary border-b border-border whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-accent to-[#06b6d4] flex items-center justify-center text-white font-bold text-[0.8rem] shrink-0">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <span className="font-semibold text-text-primary">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary border-b border-border whitespace-nowrap">
                    {formatDate(user.dateOfBirth)}
                  </td>
                  <td className="px-5 py-4 border-b border-border whitespace-nowrap">
                    <span className="text-accent font-medium">{user.email}</span>
                  </td>
                  <td className="px-5 py-4 text-text-secondary border-b border-border whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgba(99,102,241,0.1)] rounded-lg text-[0.8rem] font-medium text-indigo-light">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
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
