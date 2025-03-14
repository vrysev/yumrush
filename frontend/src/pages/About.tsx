import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.scss';

const About: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="about-page">
      <div className="container">
        <h1>{t('aboutYumRush')}</h1>
        
        <section className="about-section">
          <h2>{t('ourStory')}</h2>
          <p>{t('ourStoryText')}</p>
        </section>
        
        <section className="about-section">
          <h2>{t('ourMission')}</h2>
          <p>{t('ourMissionText')}</p>
        </section>
        
        <section className="about-section">
          <h2>{t('qualityPromise')}</h2>
          <p>{t('qualityPromiseText')}</p>
        </section>
        
        <section className="about-section">
          <h2>{t('joinOurTeam')}</h2>
          <p>{t('joinOurTeamText')}</p>
        </section>
      </div>
    </div>
  );
};

export default About;