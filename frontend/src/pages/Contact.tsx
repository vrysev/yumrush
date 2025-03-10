import React, { useState } from 'react';
import './Contact.scss';

const Contact: React.FC = () => {
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
        <h1>Contact Us</h1>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <h3>Customer Service</h3>
              <p>Have a question about your order?</p>
              <p><strong>Email:</strong> support@yumrush.com</p>
              <p><strong>Phone:</strong> (555) 123-4567</p>
              <p><strong>Hours:</strong> 8am - 10pm, 7 days a week</p>
            </div>
            
            <div className="info-item">
              <h3>Business Inquiries</h3>
              <p>Interested in partnering with YumRush?</p>
              <p><strong>Email:</strong> partners@yumrush.com</p>
              <p><strong>Phone:</strong> (555) 987-6543</p>
            </div>
            
            <div className="info-item">
              <h3>Main Office</h3>
              <p>123 Food Street</p>
              <p>New York, NY 10001</p>
            </div>
          </div>
          
          <div className="contact-form-container">
            {submitted ? (
              <div className="form-success">
                <h2>Thank you for your message!</h2>
                <p>We've received your inquiry and will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn">Send another message</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
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
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Issue</option>
                    <option value="account">Account Question</option>
                    <option value="partner">Restaurant Partnership</option>
                    <option value="feedback">General Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
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
                  {submitting ? 'Sending...' : 'Send Message'}
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