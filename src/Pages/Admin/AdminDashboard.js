import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../Components/Admin/AdminLayout';
import {
  productsRef,
  reportsRef,
  usersRef,
} from '../../firebase/collections';
import { silentCatch } from '../../utils/errorHandler';
import './AdminDashboard.css';

function AdminDashboard() {
  const [counts, setCounts] = useState({
    users: 0,
    ads: 0,
    reports: 0,
    pendingAds: 0,
    approvedAds: 0,
    rejectedAds: 0,
  });

  const [recentAds, setRecentAds] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersRef().get(),
      productsRef().get(),
      reportsRef().get(),
    ])
      .then(([usersSnap, adsSnap, reportsSnap]) => {
        const users = usersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const ads = adsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const reports = reportsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCounts({
          users: users.length,
          ads: ads.length,
          reports: reports.length,
          pendingAds: ads.filter((ad) => ad.moderationStatus === 'pending').length,
          approvedAds: ads.filter(
            (ad) => (ad.moderationStatus || 'approved') === 'approved'
          ).length,
          rejectedAds: ads.filter((ad) => ad.moderationStatus === 'rejected').length,
        });

        setRecentAds(ads.slice(0, 5));
        setLatestUsers(users.slice(0, 5));
      })
      .catch(silentCatch('AdminDashboard:loadCounts'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="dashboardPage">
        <div className="dashboardHeader">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Overview of your SwapDeal marketplace activity.</p>
          </div>

          <div className="dashboardQuickActions">
            <Link to="/admin/ads" className="dashboardActionBtn">
              Moderate Ads
            </Link>
            <Link to="/admin/users" className="dashboardActionBtn secondary">
              Manage Users
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="dashboardLoading">Loading dashboard...</div>
        ) : (
          <>
            <div className="dashboardStatsGrid">
              <div className="dashboardStatCard blue">
                <h3>Total Users</h3>
                <p>{counts.users}</p>
              </div>

              <div className="dashboardStatCard green">
                <h3>Total Ads</h3>
                <p>{counts.ads}</p>
              </div>

              <div className="dashboardStatCard red">
                <h3>Reports</h3>
                <p>{counts.reports}</p>
              </div>

              <div className="dashboardStatCard orange">
                <h3>Pending Ads</h3>
                <p>{counts.pendingAds}</p>
              </div>

              <div className="dashboardStatCard emerald">
                <h3>Approved Ads</h3>
                <p>{counts.approvedAds}</p>
              </div>

              <div className="dashboardStatCard pink">
                <h3>Rejected Ads</h3>
                <p>{counts.rejectedAds}</p>
              </div>
            </div>

            <div className="dashboardContentGrid">
              <div className="dashboardPanel">
                <div className="dashboardPanelHeader">
                  <h2>Recent Ads</h2>
                  <Link to="/admin/ads">View all</Link>
                </div>

                {recentAds.length === 0 ? (
                  <p className="dashboardEmpty">No ads found.</p>
                ) : (
                  <div className="dashboardList">
                    {recentAds.map((ad) => (
                      <div key={ad.id} className="dashboardListItem">
                        <div>
                          <p className="dashboardPrimaryText">{ad.name || 'Untitled Ad'}</p>
                          <p className="dashboardSecondaryText">
                            {ad.category || 'No category'} • {ad.moderationStatus || 'approved'}
                          </p>
                        </div>
                        <Link to={`/ad/${ad.id}`} target="_blank" className="dashboardViewLink">
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="dashboardPanel">
                <div className="dashboardPanelHeader">
                  <h2>Latest Users</h2>
                  <Link to="/admin/users">View all</Link>
                </div>

                {latestUsers.length === 0 ? (
                  <p className="dashboardEmpty">No users found.</p>
                ) : (
                  <div className="dashboardList">
                    {latestUsers.map((user) => (
                      <div key={user.id} className="dashboardListItem">
                        <div>
                          <p className="dashboardPrimaryText">{user.name || 'Unnamed User'}</p>
                          <p className="dashboardSecondaryText">
                            {user.email || 'No email'} • {user.role || 'user'}
                          </p>
                        </div>
                        <span className={`dashboardBadge ${user.role === 'admin' ? 'purple' : 'blue'}`}>
                          {user.role || 'user'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
