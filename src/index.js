import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import { initAnalytics } from './firebase/analytics';
import { initAppCheck } from './firebase/appCheck';
import { initPerformance } from './firebase/performance';
import { fetchRemoteConfig } from './firebase/remoteConfig';
import { silentCatch } from './utils/errorHandler';

// Suppress Firestore internal permission errors that bypass onSnapshot handlers
window.addEventListener('unhandledrejection', (event) => {
  const err = event.reason;
  if (err && err.code === 'permission-denied') {
    console.warn('Firestore permission-denied (suppressed):', err.message);
    event.preventDefault();
  }
});

initAnalytics();
initPerformance();
initAppCheck();
fetchRemoteConfig().catch(silentCatch('index:fetchRemoteConfig'));

ReactDOM.render(
  <HashRouter>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </HashRouter>,
  document.getElementById('root')
);
