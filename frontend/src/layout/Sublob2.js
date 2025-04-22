import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Space, Drawer, Menu } from 'antd';
import { 
  FileTextOutlined, 
  MedicineBoxOutlined, 
  FileSearchOutlined, 
  QuestionCircleOutlined, 
  MenuOutlined
} from '@ant-design/icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

import UWQuestions from '../lob/commercialproperty/UWQuestions';
import CreateSubmission from '../SidebarComponents/CreateSubmission';
import Documents from './Documents';
import ReportAnalysis from '../lob/commercialproperty/ReportAnalysis';
import RequirementsTable from '../lob/commercialproperty/RequirementTable';
import ECGAnalysis from '../layout/ReportAnalysisScreen';
import FinancialAnalysis from '../lob/commercialproperty/FinancialAnalysis';

const Sublob2 = (props) => {
  const sections = [
    'policyInfo',
    'requirements',
    'financialAnalysis',
    'reportAnalysis',
    'uw'
  ];
  
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const showSublob = (sectionId) => {
    setActiveSection(sectionId);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const goToNextSection = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    }
  };

  const buttonData = [
    { key: 'policyInfo', icon: <FileTextOutlined />, text: 'Proposal Proposer Info' },
    { key: 'requirements', icon: <MedicineBoxOutlined />, text: 'Requirement' },
    { key: 'financialAnalysis', icon: <FileSearchOutlined />, text: 'Financial Analysis' },
    { key: 'reportAnalysis', icon: <FileSearchOutlined />, text: 'Medical Analysis' },
    { key: 'uw', icon: <QuestionCircleOutlined />, text: 'UW Questions' },
  ];

  // Responsive button text based on available space
  const getButtonText = (text, width) => {
    // Very small screens - just show icon
    if (width < 576) {
      return '';
    }
    
    // Small screens - abbreviate text if needed
    if (width < 992) {
      if (text === 'Proposal Proposer Info') return 'Proposal Info';
      if (text === 'Financial Analysis') return 'Financial';
      if (text === 'Medical Analysis') return 'Medical';
      if (text === 'UW Questions') return 'UW Q\'s';
      return text;
    }
    
    // Normal screens - full text
    return text;
  };

  // Desktop navigation with evenly spaced buttons
  const DesktopNavigation = () => (
    <div 
      className="nav-container" 
      style={{
        width: '100%',
        padding: '12px 4px', // Reduced horizontal padding
        marginBottom: '6px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {buttonData.map((section, index) => (
        <div 
          key={section.key} 
          style={{
            flex: '1',
            paddingLeft: index === 0 ? '0' : '2px', // Minimal left gap
            paddingRight: index === buttonData.length - 1 ? '0' : '2px', // Minimal right gap
          }}
        >
          <Button
            type={activeSection === section.key ? 'primary' : 'default'}
            onClick={() => showSublob(section.key)}
            icon={section.icon}
            style={{
              width: '100%', // Full width of parent
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: windowWidth < 768 ? '12px' : '14px',
              padding: '0 6px', // Reduced internal padding
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              borderRadius: '4px', // Slightly reduced border radius
              transition: 'all 0.3s',
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {getButtonText(section.text, windowWidth)}
          </Button>
        </div>
      ))}
    </div>
  );

  // Mobile navigation drawer
  const MobileNavigation = () => (
    <>
      <div style={{ 
        padding: '12px',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#f0f2f5',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          {buttonData.find(item => item.key === activeSection)?.text || 'Insurance Application'}
        </span>
        <Button 
          icon={<MenuOutlined />} 
          onClick={() => setDrawerVisible(true)}
          type="primary"
        />
      </div>
      
      <Drawer
        title="Sections"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={250}
      >
        <Menu
          mode="vertical"
          selectedKeys={[activeSection]}
          style={{ border: 'none' }}
        >
          {buttonData.map(section => (
            <Menu.Item 
              key={section.key} 
              icon={section.icon}
              onClick={() => showSublob(section.key)}
            >
              {section.text}
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
    </>
  );

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Always show the navigation header that fills the full width */}
      {isMobile ? <MobileNavigation /> : <DesktopNavigation />}

      <div style={{ marginTop: '16px', padding: '0 16px', width: '100%' }}>
        {activeSection === 'policyInfo' && <CreateSubmission onNext={goToNextSection} />}
        {activeSection === 'requirements' && <RequirementsTable onNext={goToNextSection}/>}
        {activeSection === 'financialAnalysis' && <FinancialAnalysis onNext={goToNextSection}/>}
        {activeSection === 'reportAnalysis' && <ECGAnalysis onNext={goToNextSection}/>}
        {activeSection === 'uw' && <UWQuestions onNext={goToNextSection} />}
      </div>
    </div>
  );
};

export default Sublob2;