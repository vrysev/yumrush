import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './CookieConsent.scss';

const CookieConsent: FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setVisible(false);
  };
  
  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setVisible(false);
  };
  
  if (!visible) return null;
  
  return (
    <div className={`cookie-consent ${visible ? 'cookie-consent--visible' : ''}`}>
      <div className="cookie-consent__container">
        <div className="cookie-consent__content">
          <h3 className="cookie-consent__title">{t('cookieTitle')}</h3>
          <p className="cookie-consent__text">
            {t('cookieText')} <a href="/privacy-policy" className="cookie-consent__link">{t('privacyPolicy')}</a>.
          </p>
        </div>
        <div className="cookie-consent__actions">
          <button 
            className="cookie-consent__button cookie-consent__button--secondary"
            onClick={acceptEssential}
          >
            {t('acceptEssential')}
          </button>
          <button 
            className="cookie-consent__button cookie-consent__button--primary"
            onClick={acceptAll}
          >
            {t('acceptAll')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;