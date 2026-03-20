import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../Components/Admin/AdminLayout';
import {
  getProductRef,
  productsRef,
  serverTimestamp,
} from '../../firebase/collections';
import './AdminAds.css';

function AdminAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moderationFilter, setModerationFilter] = useState('');

  useEffect(() => {
    setLoading(true);

    let q = productsRef().orderBy('createdAt', 'desc').limit(100);

    if (moderationFilter) {
      q = productsRef()
        .where('moderationStatus', '==', moderationFilter)
        .orderBy('createdAt', 'desc')
        .limit(100);
    }

    q.get()
      .then((snap) => {
        setAds(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .catch((err) => {
        console.error('AdminAds fetch error:', err);
        setAds([]);
      })
      .finally(() => setLoading(false));
  }, [moderationFilter]);

  const updateModeration = (id, status) => {
    getProductRef(id)
      .update({
        moderationStatus: status,
        updatedAt: serverTimestamp(),
      })
      .then(() => {
        setAds((prev) =>
          prev.map((ad) =>
            ad.id === id ? { ...ad, moderationStatus: status } : ad
          )
        );
      })
      .catch((err) => {
        console.error('Update moderation error:', err);
      });
  };

  const deleteAd = (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    getProductRef(id)
      .delete()
      .then(() => {
        setAds((prev) => prev.filter((ad) => ad.id !== id));
      })
      .catch((err) => {
        console.error('Delete Ad Error:', err);
      });
  };

  const getStatusClass = (status) => {
    if (status === 'active') return 'badge badgeGreen';
    if (status === 'sold') return 'badge badgeGray';
    return 'badge badgeGray';
  };

  const getModerationClass = (status) => {
    if (status === 'approved') return 'badge badgeGreen';
    if (status === 'pending') return 'badge badgeYellow';
    if (status === 'rejected') return 'badge badgeRed';
    if (status === 'flagged') return 'badge badgeOrange';
    return 'badge badgeGray';
  };

  return (
    <AdminLayout>
      <div className="adminAdsPage">
        <div className="adminAdsHeader">
          <div>
            <h1>Ads</h1>
            <p>Manage, approve, reject, and delete marketplace listings.</p>
          </div>

          <div className="adminAdsFilterBox">
            <label htmlFor="moderationFilter">Moderation</label>
            <select
              id="moderationFilter"
              value={moderationFilter}
              onChange={(e) => setModerationFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="adminAdsLoading">Loading ads...</div>
        ) : (
          <div className="adminAdsCard">
            <div className="adminTableWrap">
              <table className="adminTable adminAdsTable">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Moderation</th>
                    <th>Reports</th>
                    <th>User</th>
                    <th>Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {ads.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="adminAdsEmpty">
                        No ads found.
                      </td>
                    </tr>
                  ) : (
                    ads.map((a) => (
                      <tr key={a.id}>
                        <td className="adTitleCell" title={a.name}>
                          {a.name}
                        </td>

                        <td>{a.category || '-'}</td>

                        <td>
                          <span className={getStatusClass(a.status || 'active')}>
                            {a.status || 'active'}
                          </span>
                        </td>

                        <td>
                          <span
                            className={getModerationClass(
                              a.moderationStatus || 'approved'
                            )}
                          >
                            {a.moderationStatus || 'approved'}
                          </span>
                        </td>

                        <td>{a.reportCount || 0}</td>

                        <td className="userIdCell" title={a.userId}>
                          {a.userId ? `${a.userId.slice(0, 12)}...` : '-'}
                        </td>

                        <td>
                          <Link
                            to={`/ad/${a.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="viewAdLink"
                          >
                            View
                          </Link>
                        </td>

                        <td>
                          <div className="actionGroup">
                            {(a.moderationStatus === 'pending' ||
                              a.moderationStatus === 'flagged') && (
                              <>
                                <button
                                  className="approveBtn"
                                  onClick={() =>
                                    updateModeration(a.id, 'approved')
                                  }
                                >
                                  Approve
                                </button>

                                <button
                                  className="rejectBtn"
                                  onClick={() =>
                                    updateModeration(a.id, 'rejected')
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            <button
                              className="deleteBtn"
                              onClick={() => deleteAd(a.id)}
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

export default AdminAds;
