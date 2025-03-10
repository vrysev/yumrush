import React from 'react';
import './About.scss';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About YumRush</h1>
        
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2024, YumRush was born from a simple idea: delivering exceptional food without
            the long wait. We believe that delicious meals should be accessible to everyone, 
            whenever hunger strikes.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At YumRush, our mission is to connect hungry customers with their favorite local
            restaurants, providing a seamless ordering experience and lightning-fast delivery.
            We're passionate about supporting local businesses while satisfying cravings.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Quality Promise</h2>
          <p>
            We partner only with restaurants that share our commitment to quality ingredients,
            exceptional taste, and responsible food handling. When you order through YumRush,
            you can expect nothing but the best.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Join Our Team</h2>
          <p>
            We're always looking for passionate people to join our growing team. Whether you're
            a developer, customer service specialist, or delivery driver, we'd love to hear from you.
            Check our careers page for current opportunities.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;