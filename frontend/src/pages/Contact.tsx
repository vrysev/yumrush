import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.scss';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    // This is a dummy submission - in a real app, you'd send this to your backend
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1>{t('contactUs')}</h1>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <h3>{t('customerService')}</h3>
              <p>{t('customerServiceText')}</p>
              <p><strong>{t('email')}:</strong> support@yumrush.com</p>
              <p><strong>{t('phone')}:</strong> (555) 123-4567</p>
              <p><strong>{t('hours')}:</strong> 8am - 10pm, 7 days a week</p>
            </div>
            
            <div className="info-item">
              <h3>{t('businessInquiries')}</h3>
              <p>{t('businessInquiriesText')}</p>
              <p><strong>{t('email')}:</strong> partners@yumrush.com</p>
              <p><strong>{t('phone')}:</strong> (555) 987-6543</p>
            </div>
            
            <div className="info-item">
              <h3>{t('mainOffice')}</h3>
              <p>123 Food Street</p>
              <p>New York, NY 10001</p>
            </div>
          </div>
          
          <div className="contact-form-container">
            {submitted ? (
              <div className="form-success">
                <h2>{t('thankYouMessage')}</h2>
                <p>{t('messageReceivedText')}</p>
                <button onClick={() => setSubmitted(false)} className="btn">{t('sendAnotherMessage')}</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">{t('yourName')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">{t('emailAddress')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">{t('subject')}</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t('selectSubject')}</option>
                    <option value="order">{t('orderIssue')}</option>
                    <option value="account">{t('accountQuestion')}</option>
                    <option value="partner">{t('restaurantPartnership')}</option>
                    <option value="feedback">{t('generalFeedback')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">{t('yourMessage')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>
                
                {error && <div className="form-error">{error}</div>}
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? t('sending') : t('sendMessage')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;