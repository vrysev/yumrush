import '@styles/main.scss';
import Header from '@components/common/Header/Header';
import { Outlet } from 'react-router-dom';
import CookieConsent from './components/CookieConsent';
import './i18n';

function App() {    
  return (
    <div className="app">
      <Header />
      <main className="wrapper">
        <Outlet />
      </main>
      <CookieConsent />
    </div>
  );
}

export default App;
