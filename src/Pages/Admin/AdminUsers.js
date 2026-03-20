import { useEffect, useState } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { usersRef } from '../../firebase/collections';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountFilter, setAccountFilter] = useState('');

  useEffect(() => {
    setLoading(true);

    let q = usersRef().limit(100);

    if (accountFilter) {
      q = usersRef().where('accountStatus', '==', accountFilter).limit(100);
    }

    q.get()
      .then((snap) => {
        setUsers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      })
      .catch((err) => {
        console.error('AdminUsers fetch error:', err);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [accountFilter]);

  const suspendUser = (id) => {
    usersRef()
      .doc(id)
      .update({ accountStatus: 'suspended' })
      .then(() => {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, accountStatus: 'suspended' } : user
          )
        );
      })
      .catch((err) => console.error('Suspend user error:', err));
  };

  const activateUser = (id) => {
    usersRef()
      .doc(id)
      .update({ accountStatus: 'active' })
      .then(() => {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, accountStatus: 'active' } : user
          )
        );
      })
      .catch((err) => console.error('Activate user error:', err));
  };

  const deleteUser = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    usersRef()
      .doc(id)
      .delete()
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      })
      .catch((err) => console.error('Delete user error:', err));
  };

  const getRoleClass = (role) => {
    if (role === 'admin') return 'badge badgePurple';
    return 'badge badgeBlue';
  };

  const getAccountClass = (status) => {
    if (status === 'active') return 'badge badgeGreen';
    if (status === 'suspended') return 'badge badgeRed';
    return 'badge badgeGray';
  };

  const getKycClass = (status) => {
    if (status === 'approved') return 'badge badgeGreen';
    if (status === 'pending') return 'badge badgeYellow';
    if (status === 'not_started') return 'badge badgeGray';
    return 'badge badgeGray';
  };

  return (
    <AdminLayout>
      <div className="adminUsersPage">
        <div className="adminUsersHeader">
          <div>
            <h1>Users</h1>
            <p>Manage users, account status, roles, and trust overview.</p>
          </div>

          <div className="adminUsersFilterBox">
            <label htmlFor="accountFilter">Account status</label>
            <select
              id="accountFilter"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="adminUsersLoading">Loading users...</div>
        ) : (
          <div className="adminUsersCard">
            <div className="adminTableWrap">
              <table className="adminTable adminUsersTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Account</th>
                    <th>KYC</th>
                    <th>Trust</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="adminUsersEmpty">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="userIdCell" title={user.id}>
                          {user.id ? `${user.id.slice(0, 18)}...` : '-'}
                        </td>

                        <td className="userNameCell">{user.name || 'Unnamed'}</td>

                        <td className="userEmailCell" title={user.email}>
                          {user.email || '-'}
                        </td>

                        <td>
                          <span className={getRoleClass(user.role || 'user')}>
                            {user.role || 'user'}
                          </span>
                        </td>

                        <td>
                          <span
                            className={getAccountClass(
                              user.accountStatus || 'active'
                            )}
                          >
                            {user.accountStatus || 'active'}
                          </span>
                        </td>

                        <td>
                          <span className={getKycClass(user.kycStatus || 'not_started')}>
                            {user.kycStatus || 'not_started'}
                          </span>
                        </td>

                        <td>{user.trustScore || 0}</td>

                        <td>
                          <div className="actionGroup">
                            {(user.accountStatus || 'active') === 'active' ? (
                              <button
                                className="suspendBtn"
                                onClick={() => suspendUser(user.id)}
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                className="activateBtn"
                                onClick={() => activateUser(user.id)}
                              >
                                Activate
                              </button>
                            )}

                            <button
                              className="deleteBtn"
                              onClick={() => deleteUser(user.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
