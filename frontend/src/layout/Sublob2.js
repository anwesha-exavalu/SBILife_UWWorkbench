import React, { useState } from 'react';
import { Button, Row, Col } from 'antd';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LossInfo from '../lob/commercialproperty/LossInfo';
import UWQuestions from '../lob/commercialproperty/UWQuestions';
import LocationComponent from '../lob/commercialproperty/LocationComponent';
import CreateSubmission from '../SidebarComponents/CreateSubmission';
import QuoteSummary from '../lob/commercialproperty/quoteSummary';
import PremiumSummary from '../lob/commercialproperty/PremiumSummary';
import Bind from '../lob/commercialproperty/Bind';
import Coverages from '../lob/commercialproperty/Coverages';
import Documents from './Documents';

const Sublob2 = (props) => {
  const sections = [
    'policyInfo',
    'locationInfo',
    'lossInfo',
    'coverages',
    'uw',
    'premiumSummary',
    'quoteSummary'
  ];
 
  const [activeSection, setActiveSection] = useState(sections[0]);

  const showSublob = (sectionId) => {
    setActiveSection(sectionId);
  };

  const goToNextSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    }
  };

  const containerStyle = {
    display: 'flex',
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: '12px',
    gap: '12px',
    backgroundColor: '#fff',
    minHeight: '60px',
    marginBottom: '10px'
  };

  const buttonStyle = {
    height: '36px',
    minWidth: '140px',
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    padding: '0 16px',
    whiteSpace: 'nowrap',
    backgroundColor: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    transition: 'all 0.3s',
    marginRight: '0'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#1890ff',
    color: '#fff',
    borderColor: '#1890ff'
  };

  const buttonData = [
    { key: 'policyInfo', icon: 'file-alt', text: 'Insured Info' },
    { key: 'locationInfo', icon: 'map-marker-alt', text: 'Risk' },
    { key: 'lossInfo', icon: 'exclamation-triangle', text: 'Loss' },
    { key: 'coverages', icon: 'shield-alt', text: 'Coverages' },
    { key: 'uw', icon: 'question-circle', text: 'UW Questions' },
    { key: 'premiumSummary', icon: 'calculator', text: 'Premium Summary' },
    { key: 'quoteSummary', icon: 'file-signature', text: 'Quote Summary' }
  ];

  return (
    <div className="flex flex-col w-full">
      <div style={containerStyle}>
        {buttonData.map(section => (
          <Button
            key={section.key}
            onClick={() => showSublob(section.key)}
            style={activeSection === section.key ? activeButtonStyle : buttonStyle}
          >
            <i className={`fas fa-${section.icon}`} />
            <span className="ml-2">{section.text}</span>
          </Button>
        ))}
      </div>

      <div className="mt-4">
        {activeSection === 'policyInfo' && <CreateSubmission onNext={goToNextSection} />}
        {activeSection === 'locationInfo' && <LocationComponent onNext={goToNextSection} />}
        {activeSection === 'lossInfo' && <LossInfo onNext={goToNextSection} />}
        {activeSection === 'coverages' && <Coverages onNext={goToNextSection} />}
        {activeSection === 'uw' && <UWQuestions onNext={goToNextSection} />}
        {activeSection === 'premiumSummary' && <PremiumSummary onNext={goToNextSection} />}
        {activeSection === 'quoteSummary' && <QuoteSummary onNext={goToNextSection} />}
      </div>

      <Documents />
    </div>
  );
};

export default Sublob2;