import { FC, useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../redux/store';
import { updateProfile } from '../../redux/slices/authSlice';
import './ProfileSettings.scss';

const ProfileSettings: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'US',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate password fields if shown
    if (showPasswordFields) {
      if (formData.password !== formData.confirmPassword) {
        setMessage({ text: 'Passwords do not match', type: 'error' });
        return;
      }
      if (formData.password && formData.password.length < 6) {
        setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
        return;
      }
    }

    // Remove confirmPassword from data sent to API
    const { confirmPassword, ...updateData } = formData;
    
    // Only include password if it was changed
    const finalUpdateData = showPasswordFields && updateData.password 
      ? updateData 
      : { ...updateData, password: undefined };

    try {
      await dispatch(updateProfile(finalUpdateData)).unwrap();
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      // Reset password fields
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      setShowPasswordFields(false);
    } catch (err) {
      setMessage({ text: typeof err === 'string' ? err : 'Failed to update profile', type: 'error' });
    }
  };

  return (
    <div className="profile-settings">
      <div className="profile-settings__container">
        <h1>Profile Settings</h1>
        
        {message && (
          <div className={`profile-settings__message profile-settings__message--${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-settings__form">
          <div className="profile-settings__section">
            <h2>Personal Information</h2>
            <div className="profile-settings__form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-settings__form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-settings__form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
              />
            </div>
          </div>

          <div className="profile-settings__section">
            <h2>Delivery Address</h2>
            <div className="profile-settings__form-group">
              <label htmlFor="address">Street Address*</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St"
                required
              />
              <small>Required for checkout</small>
            </div>

            <div className="profile-settings__form-group">
              <label htmlFor="city">City*</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                required
              />
              <small>Required for checkout</small>
            </div>

            <div className="profile-settings__form-row">
              <div className="profile-settings__form-group">
                <label htmlFor="postalCode">Postal Code*</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="12345"
                  required
                />
                <small>Required for checkout</small>
              </div>

              <div className="profile-settings__form-group">
                <label htmlFor="country">Country*</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
                <small>Required for checkout</small>
              </div>
            </div>
          </div>

          <div className="profile-settings__section">
            <div className="profile-settings__password-header">
              <h2>Password</h2>
              <button 
                type="button" 
                className="profile-settings__toggle-btn"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
              >
                {showPasswordFields ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordFields && (
              <>
                <div className="profile-settings__form-group">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <div className="profile-settings__form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </>
            )}
          </div>

          <div className="profile-settings__actions">
            <button 
              type="submit" 
              className="profile-settings__save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;