import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import {
  activityLogRef,
  offersRef,
  productsRef,
  transactionsRef,
  usersRef,
} from '../../firebase/collections';
import './AdminAnalytics.css';

function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAds: 0,
    activeAds: 0,
    pendingAds: 0,
    approvedAds: 0,
    rejectedAds: 0,
    totalTransactions: 0,
    completedTransactions: 0,
    totalOffers: 0,
    acceptedOffers: 0,
    pendingOffers: 0,
    activityLogCount: 0,
  });

  const [topCategories, setTopCategories] = useState([]);
  const [recentAds, setRecentAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const safeDocs = (query) =>
      query
        .get()
        .then((snap) => snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        .catch(() => []);

    Promise.all([
      safeDocs(usersRef()),
      safeDocs(productsRef()),
      safeDocs(transactionsRef()),
      safeDocs(offersRef()),
      safeDocs(activityLogRef().limit(20)),
    ])
      .then(([users, products, transactions, offers, activityLogs]) => {
        const pendingAds = products.filter(
          (ad) => ad.moderationStatus === 'pending'
        ).length;

        const approvedAds = products.filter(
          (ad) => (ad.moderationStatus || 'approved') === 'approved'
        ).length;

        const rejectedAds = products.filter(
          (ad) => ad.moderationStatus === 'rejected'
        ).length;

        const activeAds = products.filter(
          (ad) => (ad.status || 'active') === 'active'
        ).length;

        const completedTransactions = transactions.filter(
          (t) => t.status === 'completed'
        ).length;

        const acceptedOffers = offers.filter(
          (offer) => offer.status === 'accepted'
        ).length;

        const pendingOffers = offers.filter(
          (offer) => offer.status === 'pending'
        ).length;

        const categoryMap = {};
        products.forEach((product) => {
          const category = product.category || 'Uncategorized';
          categoryMap[category] = (categoryMap[category] || 0) + 1;
        });

        const sortedCategories = Object.entries(categoryMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        setStats({
          totalUsers: users.length,
          totalAds: products.length,
          activeAds,
          pendingAds,
          approvedAds,
          rejectedAds,
          totalTransactions: transactions.length,
          completedTransactions,
          totalOffers: offers.length,
          acceptedOffers,
          pendingOffers,
          activityLogCount: activityLogs.length,
        });

        setTopCategories(sortedCategories);
        setRecentAds(products.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const moderationData = useMemo(
    () => [
      {
        label: 'Pending Ads',
        value: stats.pendingAds,
        className: 'badge badgeYellow',
      },
      {
        label: 'Approved Ads',
        value: stats.approvedAds,
        className: 'badge badgeGreen',
      },
      {
        label: 'Rejected Ads',
        value: stats.rejectedAds,
        className: 'badge badgeRed',
      },
    ],
    [stats]
  );

  return (
    <AdminLayout>
      <div className="adminAnalyticsPage">
        <div className="adminAnalyticsHeader">
          <div>
            <h1>Analytics</h1>
            <p>Track marketplace performance, moderation, offers, and activity.</p>
          </div>
        </div>

        {loading ? (
          <div className="adminAnalyticsLoading">Loading analytics...</div>
        ) : (
          <>
            <div className="adminAnalyticsStatsGrid">
              <div className="analyticsStatCard blue">
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
              </div>

              <div className="analyticsStatCard green">
                <h3>Total Ads</h3>
                <p>{stats.totalAds}</p>
              </div>

              <div className="analyticsStatCard emerald">
                <h3>Active Ads</h3>
                <p>{stats.activeAds}</p>
              </div>

              <div className="analyticsStatCard orange">
                <h3>Pending Ads</h3>
                <p>{stats.pendingAds}</p>
              </div>

              <div className="analyticsStatCard red">
                <h3>Transactions</h3>
                <p>{stats.totalTransactions}</p>
                <span>{stats.completedTransactions} completed</span>
              </div>

              <div className="analyticsStatCard purple">
                <h3>Offers</h3>
                <p>{stats.totalOffers}</p>
                <span>{stats.acceptedOffers} accepted</span>
              </div>
            </div>

            <div className="adminAnalyticsContentGrid">
              <div className="analyticsPanel">
                <div className="analyticsPanelHeader">
                  <h2>Moderation Overview</h2>
                </div>

                <div className="analyticsBadgeList">
                  {moderationData.map((item) => (
                    <div key={item.label} className="analyticsBadgeRow">
                      <span>{item.label}</span>
                      <span className={item.className}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analyticsPanel">
                <div className="analyticsPanelHeader">
                  <h2>Offers & Transactions</h2>
                </div>

                <div className="analyticsMiniStats">
                  <div className="analyticsMiniStat">
                    <label>Pending Offers</label>
                    <strong>{stats.pendingOffers}</strong>
                  </div>

                  <div className="analyticsMiniStat">
                    <label>Accepted Offers</label>
                    <strong>{stats.acceptedOffers}</strong>
                  </div>

                  <div className="analyticsMiniStat">
                    <label>Completed Transactions</label>
                    <strong>{stats.completedTransactions}</strong>
                  </div>

                  <div className="analyticsMiniStat">
                    <label>Activity Logs</label>
                    <strong>{stats.activityLogCount}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="adminAnalyticsBottomGrid">
              <div className="analyticsPanel">
                <div className="analyticsPanelHeader">
                  <h2>Top Categories</h2>
                </div>

                {topCategories.length === 0 ? (
                  <p className="analyticsEmpty">No category data found.</p>
                ) : (
                  <div className="analyticsList">
                    {topCategories.map((category) => (
                      <div key={category.name} className="analyticsListItem">
                        <span className="analyticsPrimaryText">{category.name}</span>
                        <span className="badge badgeBlue">{category.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="analyticsPanel">
                <div className="analyticsPanelHeader">
                  <h2>Recent Ads</h2>
                </div>

                {recentAds.length === 0 ? (
                  <p className="analyticsEmpty">No recent ads found.</p>
                ) : (
                  <div className="analyticsList">
                    {recentAds.map((ad) => (
                      <div key={ad.id} className="analyticsListItem">
                        <div>
                          <p className="analyticsPrimaryText">
                            {ad.name || 'Untitled Ad'}
                          </p>
                          <p className="analyticsSecondaryText">
                            {ad.category || 'No category'}
                          </p>
                        </div>
                        <span
                          className={
                            (ad.moderationStatus || 'approved') === 'approved'
                              ? 'badge badgeGreen'
                              : ad.moderationStatus === 'pending'
                              ? 'badge badgeYellow'
                              : ad.moderationStatus === 'rejected'
                              ? 'badge badgeRed'
                              : 'badge badgeGray'
                          }
                        >
                          {ad.moderationStatus || 'approved'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="adminAnalyticsNote">
              View Firebase Console &gt; Analytics for user events and Performance
              Monitoring for deeper app metrics.
            </p>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAnalytics;
