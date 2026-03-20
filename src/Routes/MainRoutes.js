import { Route, Switch } from 'react-router-dom';
import AdminRoute from '../Components/Auth/AdminRoute';
import ProtectedRoute from '../Components/Auth/ProtectedRoute';
import CookieConsent from '../Components/CookieConsent/CookieConsent';
import TopProgressBar from '../Components/Loading/TopProgressBar';
import ScrollToTop from '../Components/Navigation/ScrollToTop';
import AboutPage from '../Pages/AboutPage';
import AddressesPage from '../Pages/Addresses';
import AdminAds from '../Pages/Admin/AdminAds';
import AdminAnalytics from '../Pages/Admin/AdminAnalytics';
import AdminCategories from '../Pages/Admin/AdminCategories';
import AdminDashboard from '../Pages/Admin/AdminDashboard';
import AdminReports from '../Pages/Admin/AdminReports';
import AdminUsers from '../Pages/Admin/AdminUsers';
import AdminVerifications from '../Pages/Admin/AdminVerifications';
import CareersPage from '../Pages/CareersPage';
import CategoryPageRoute from '../Pages/CategoryPage';
import ChatPage from '../Pages/Chat';
import Compare from '../Pages/Compare';
import ContactPage from '../Pages/ContactPage';
import CreatePost from '../Pages/CreatePost';
import Dashboard from '../Pages/Dashboard';
import EditAdPage from '../Pages/EditAd';
import EditProfile from '../Pages/EditProfile';
import FollowersPage from '../Pages/FollowersPage';
import ForgotPasswordPage from '../Pages/ForgotPassword';
import HelpPage from '../Pages/HelpPage';
import Home from '../Pages/Home';
import LegalPage from '../Pages/LegalPage';
import Login from '../Pages/Login';
import MessagesPage from '../Pages/Messages';
import Nearby from '../Pages/Nearby';
import NotFound from '../Pages/NotFound';
import NotificationsPage from '../Pages/Notifications';
import PeoplePage from '../Pages/PeoplePage';
import Profile from '../Pages/Profile';
import PromoteAd from '../Pages/PromoteAd';
import SearchResultsPage from '../Pages/SearchResults';
import SellerStore from '../Pages/SellerStore';
import Signup from '../Pages/Signup';
import SitemapPage from '../Pages/SitemapPage';
import TransactionsPage from '../Pages/Transactions';
import ViewMore from '../Pages/ViewMore';
import ViewPost from '../Pages/ViewPost';

function MainRoutes() {
  return (
    <>
      <TopProgressBar />
      <ScrollToTop />
      <CookieConsent />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/forgot-password">
          <ForgotPasswordPage />
        </Route>
        <Route path="/search">
          <SearchResultsPage />
        </Route>
        <Route path="/category/:categoryId">
          <CategoryPageRoute />
        </Route>
        <Route exact path="/view">
          <ViewPost />
        </Route>
        <Route exact path="/ad/:adId">
          <ViewPost />
        </Route>
        <Route path="/viewmore">
          <ViewMore />
        </Route>
        <ProtectedRoute path="/profile/edit">
          <EditProfile />
        </ProtectedRoute>
        <Route path="/profile/:userId/followers">
          <FollowersPage />
        </Route>
        <Route path="/profile/:userId/following">
          <FollowersPage />
        </Route>
        <Route path="/profile/:userId">
          <Profile />
        </Route>
        <Route path="/seller/:userId/store">
          <SellerStore />
        </Route>
        <ProtectedRoute path="/ad/:adId/edit">
          <EditAdPage />
        </ProtectedRoute>
        <ProtectedRoute path="/ad/:adId/promote">
          <PromoteAd />
        </ProtectedRoute>
        <ProtectedRoute path="/create">
          <CreatePost />
        </ProtectedRoute>
        <ProtectedRoute path="/dashboard/transactions">
          <TransactionsPage />
        </ProtectedRoute>
        <ProtectedRoute path="/dashboard/addresses">
          <AddressesPage />
        </ProtectedRoute>
        <ProtectedRoute path="/dashboard">
          <Dashboard />
        </ProtectedRoute>
        <ProtectedRoute path="/notifications">
          <NotificationsPage />
        </ProtectedRoute>
        <ProtectedRoute path="/messages">
          <MessagesPage />
        </ProtectedRoute>
        <ProtectedRoute path="/chat/:conversationId">
          <ChatPage />
        </ProtectedRoute>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/careers">
          <CareersPage />
        </Route>
        <Route path="/contact">
          <ContactPage />
        </Route>
        <Route path="/people">
          <PeoplePage />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/sitemap">
          <SitemapPage />
        </Route>
        <Route path="/legal">
          <LegalPage />
        </Route>
        <Route path="/nearby">
          <Nearby />
        </Route>
        <Route path="/compare">
          <Compare />
        </Route>
        <AdminRoute exact path="/admin">
          <AdminDashboard />
        </AdminRoute>
        <AdminRoute path="/admin/users">
          <AdminUsers />
        </AdminRoute>
        <AdminRoute path="/admin/ads">
          <AdminAds />
        </AdminRoute>
        <AdminRoute path="/admin/verifications">
          <AdminVerifications />
        </AdminRoute>
        <AdminRoute path="/admin/reports">
          <AdminReports />
        </AdminRoute>
        <AdminRoute path="/admin/categories">
          <AdminCategories />
        </AdminRoute>
        <AdminRoute path="/admin/analytics">
          <AdminAnalytics />
        </AdminRoute>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default MainRoutes;
