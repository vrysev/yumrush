import { FC, useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../../redux/slices/authSlice';
import './AuthModal.scss';
import { AppDispatch, RootState } from '../../redux/store';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Close modal when successfully authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      resetForm();
    }
  }, [isAuthenticated, isOpen, onClose]);

  // Clear form errors when switching tabs
  useEffect(() => {
    setFormError('');
    dispatch(clearError());
  }, [activeTab, dispatch]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFormError('');
  };

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    resetForm();
  };

  const validateForm = (): boolean => {
    setFormError('');

    if (!email.trim() || !password.trim()) {
      setFormError(t('fillAllFields'));
      return false;
    }

    if (activeTab === 'register') {
      if (!name.trim()) {
        setFormError(t('enterName'));
        return false;
      }

      if (password !== confirmPassword) {
        setFormError(t('passwordsDontMatch'));
        return false;
      }

      if (password.length < 6) {
        setFormError(t('passwordMinLength'));
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (activeTab === 'login') {
      dispatch(login({ email, password }));
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <div className={`auth-modal ${isOpen ? 'auth-modal--open' : ''}`}>
      <div className="auth-modal__content">
        <div className="auth-modal__header">
          <h2>{t('welcomeToYumrush')}</h2>
          <div className="auth-modal__header-tabs">
            <div
              className={`auth-modal__tab ${activeTab === 'login' ? 'auth-modal__tab--active' : ''}`}
              onClick={() => switchTab('login')}
            >
              {t('Login')}
            </div>
            <div
              className={`auth-modal__tab ${activeTab === 'register' ? 'auth-modal__tab--active' : ''}`}
              onClick={() => switchTab('register')}
            >
              {t('Register')}
            </div>
          </div>
          <button className="auth-modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="auth-modal__body">
          <form className="auth-modal__form" onSubmit={handleSubmit}>
            {activeTab === 'register' && (
              <div className="auth-modal__field">
                <label htmlFor="name">{t('fullName')}</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enterYourName')}
                />
              </div>
            )}
            <div className="auth-modal__field">
              <label htmlFor="email">{t('emailAddress')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('enterYourEmail')}
              />
            </div>
            <div className="auth-modal__field">
              <label htmlFor="password">{t('password')}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('enterYourPassword')}
              />
            </div>
            {activeTab === 'register' && (
              <div className="auth-modal__field">
                <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('confirmYourPassword')}
                />
              </div>
            )}
            {(formError || error) && <div className="auth-modal__error">{formError || error}</div>}
            <button type="submit" className="auth-modal__submit" disabled={loading}>
              {loading
                ? t('pleaseWait')
                : activeTab === 'login'
                ? t('signIn')
                : t('createAccount')}
            </button>
          </form>
        </div>
        <div className="auth-modal__footer">
          {activeTab === 'login' ? (
            <p>
              {t('dontHaveAccount')}{' '}
              <a onClick={() => switchTab('register')}>{t('registerNow')}</a>
            </p>
          ) : (
            <p>
              {t('alreadyHaveAccount')}{' '}
              <a onClick={() => switchTab('login')}>{t('signIn')}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
