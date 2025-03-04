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

const Sublob2 = (props) => {
  const sections = [
    'policyInfo',
    'requirements',
    'reportAnalysis',
    'uw'
  ];
  
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
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
    { key: 'reportAnalysis', icon: <FileSearchOutlined />, text: 'Medical Analysis' },
    { key: 'uw', icon: <QuestionCircleOutlined />, text: 'UW Questions' },
  ];

  // Desktop navigation with evenly spaced buttons
  const DesktopNavigation = () => (
    <Row className="nav-container" style={{
      width: '100%',
      padding: '12px 0',
      marginBottom: '6px'
    }}>
      {buttonData.map((section, index) => (
        <Col key={section.key} span={24 / buttonData.length}>
          <Button
            type={activeSection === section.key ? 'primary' : 'default'}
            onClick={() => showSublob(section.key)}
            icon={section.icon}
            style={{
              width: '90%',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              padding: '0 10px',
              whiteSpace: 'nowrap',
              borderRadius: '6px',
              transition: 'all 0.3s',
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
            }}
          >
            {section.text}
          </Button>
        </Col>
      ))}
    </Row>
  );

  // Mobile navigation drawer
  const MobileNavigation = () => (
    <>
      <div style={{ 
        padding: '12px 0',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontWeight: 'bold', marginLeft: '12px' }}>
          {buttonData.find(item => item.key === activeSection)?.text || 'Insurance Application'}
        </span>
        <Button 
          icon={<MenuOutlined />} 
          onClick={() => setDrawerVisible(true)}
          type="primary"
          style={{ marginRight: '12px' }}
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
    <div className="flex flex-col w-full">
      {isMobile ? <MobileNavigation /> : <DesktopNavigation />}

      <div className="mt-4 px-4">
        {activeSection === 'policyInfo' && <CreateSubmission onNext={goToNextSection} />}
        {activeSection === 'requirements' && <RequirementsTable onNext={goToNextSection}/>}
        {activeSection === 'reportAnalysis' && <ECGAnalysis onNext={goToNextSection}/>}
        {activeSection === 'uw' && <UWQuestions onNext={goToNextSection} />}
      </div>

    
    </div>
  );
};

export default Sublob2;