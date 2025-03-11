import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";

import Dashboard from './SidebarComponents/Dashboard';
import DocumentScreen from './SidebarComponents/DocumentScreen';
import ClearanceScreen from './SidebarComponents/ClearanceScreen';
import SearchInsured from './SidebarComponents/SearchInsured';
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, InfoCircleOutlined, EditFilled, FileTextOutlined, IdcardOutlined, SettingOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import HeaderDesign from './layout/HeaderDesign';

import { Divider } from 'antd';
import Sublob2 from './layout/Sublob2';
import AuditTrail from './SidebarComponents/AuditTrail';
import AccountInfo from './SidebarComponents/AccountInfo';
import AccountDashboard from './SidebarComponents/AccountDashboard';
import Login from './layout/Login';
import UploadFile from './Adhaar_Masking/UploadFile';
import BulkMasking from './Adhaar_Masking/BulkMasking';
import NextScreen from './Adhaar_Masking/NextScreen';


const { Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

const MyMenu = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  
  // This effect loads the role and ensures default view
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    // Redirect to first appropriate page based on role if on dashboard
    if (location.pathname === '/dashboard') {
      if (role === 'admin') {
        navigate('/individualaadhaarmasking');
      }
    }
    
    // Redirect to first submenu if on admin root path
    if (role === 'admin' && location.pathname === '/') {
      navigate('/individualaadhaarmasking');
    }
  }, [navigate, location.pathname]);

  // Create a key lookup based on pathname
  const currentPath = location.pathname;
  
  // Determine which key should be selected based on current path
  let selectedKeys = [];
  let openKeys = [];
  
  if (userRole === 'underwriter') {
    if (currentPath === '/dashboard') selectedKeys = ['1'];
    else if (currentPath === '/createsubmission') selectedKeys = ['4'];
  } else if (userRole === 'admin') {
    if (currentPath === '/individualaadhaarmasking') {
      selectedKeys = ['5'];
      openKeys = ['sub1']; 
    }
    else if (currentPath === '/masking-settings') {
      selectedKeys = ['6'];
      openKeys = ['sub1'];
    }
    else if (currentPath === '/bulkaadhaarmasking') {
      selectedKeys = ['7'];
      openKeys = ['sub1'];
    }
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={selectedKeys}
      defaultOpenKeys={openKeys}
      inlineIndent={12}
      className="custom-sidebar-menu"
    >
      {/* Show these items only for underwriter role */}
      {userRole === 'underwriter' && (
        <>
          <Menu.Item key="1" icon={<HomeOutlined />} title={"Dashboard"}>
            {!collapsed ? <Link to="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link> : <Link to="/dashboard" style={{ textDecoration: 'none' }}/>}
          </Menu.Item>
          <Menu.Item key="4" icon={<EditFilled />} title={"Create Submission"}>
            {!collapsed ? <Link to="/createsubmission" style={{ textDecoration: 'none' }}>Create Submission</Link> : <Link to="/createsubmission" style={{ textDecoration: 'none' }}/>}
          </Menu.Item>
        </>
      )}

      {/* Show these items only for admin role */}
      {userRole === 'admin' && (
        <SubMenu 
          key="sub1" 
          icon={<IdcardOutlined />} 
          title={!collapsed ? "Aadhaar Masking" : ""}
          popupClassName="sidebar-submenu-popup"
        >
          <Menu.Item key="5" icon={<FileSearchOutlined />}>
            {!collapsed ? 
              <Link to="/individualaadhaarmasking" style={{ textDecoration: 'none' }}>Individual Masking </Link> : 
              <Link to="/individualaadhaarmasking" style={{ textDecoration: 'none' }} />
            }
          </Menu.Item>
          {/* <Menu.Item key="6" icon={<SettingOutlined />}>
            {!collapsed ? 
              <Link to="/masking-settings" style={{ textDecoration: 'none' }}>Masking Settings</Link> : 
              <Link to="/masking-settings" style={{ textDecoration: 'none' }} />
            }
          </Menu.Item> */}
          <Menu.Item key="7" icon={<FileTextOutlined />}>
            {!collapsed ? 
              <Link to="/bulkaadhaarmasking" style={{ textDecoration: 'none' }}>Bulk Masking</Link> : 
              <Link to="/bulkaadhaarmasking" style={{ textDecoration: 'none' }} />
            }
          </Menu.Item>
        </SubMenu>
      )}
    </Menu>
  );
};

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/';

  useEffect(() => {
    // Get the user role from localStorage
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    // If user is on the root path and already logged in as admin, redirect to individualaadhaarmasking
    if (role === 'admin' && location.pathname === '/dashboard') {
      navigate('/individualaadhaarmasking');
    }
    
    // Add custom CSS to fix the submenu overflow issue
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-sidebar-menu .ant-menu-sub.ant-menu-inline {
        background: #2457d3 !important;
        max-width: 100% !important;
        overflow: hidden !important;
      }
      
      .custom-sidebar-menu .ant-menu-submenu-title {
        padding-right: 16px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      
      .custom-sidebar-menu .ant-menu-item {
        padding-right: 16px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      
      .custom-sidebar-menu.ant-menu-inline-collapsed .ant-menu-submenu-title {
        text-align: center !important;
        padding: 0 !important;
        width: 100% !important;
      }
      
      .custom-sidebar-menu .ant-menu-submenu-arrow {
        right: 8px !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [location.pathname, navigate]);

  return (
    <Layout>
      {!isLoginPage && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ 
            backgroundColor: '#2457d3', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden'
          }}
          width={220} // Set a fixed width for the Sider
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{ color: "white" }} /> : <MenuFoldOutlined style={{ color: "white" }} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '46px',
              width: '50px',
              height: '60px',
            }}
          />
          {!collapsed && <h4 style={{ color: 'white', textAlign: 'center' }}>Intelligent Risk Assessment</h4>}
          <Divider
            variant="dotted"
            style={{
              borderColor: 'black',
              width: '100%',
            }}
          />
          <div className="demo-logo-vertical" />
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <MyMenu collapsed={collapsed} />
          </div>
        </Sider>
      )}
      <Layout>
        {!isLoginPage && <HeaderDesign />}
        <Content
          style={{
            margin: '5px 9px',
            padding: 24,
            minHeight: 560,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="createsubmission" element={<Sublob2 />} />
            <Route path="audit-trail" element={<AuditTrail />} />
            <Route path="accountdashboard" element={<AccountDashboard />} />
            <Route path="accountinfo" element={<AccountInfo />} />
            <Route path="documentscreen" element={<DocumentScreen />} />
            <Route path="clearancescreen" element={<ClearanceScreen />} />
            <Route path="searchinsured" element={<SearchInsured />} />
            <Route path="individualaadhaarmasking" element={<UploadFile/>} />
            {/* <Route path="masking-settings" element={<MaskingSettings />} /> */}
            <Route path="bulkaadhaarmasking" element={<BulkMasking/>} />
            <Route path="/secondScreen" element={<NextScreen />} />
          </Routes>
        </Content>
        {!isLoginPage && (
          <Footer style={{ textAlign: 'center' }}>
            Workbench {new Date().getFullYear()}
          </Footer>
        )}
      </Layout>
    </Layout>
  );
};

// Additional placeholder components for admin views
// const MaskingSettings = () => {
//   return (
//     <div>
//       <h2>Aadhaar Masking Settings</h2>
//       <div style={{padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
//         <h3>Masking Configuration</h3>
//         <p>Configure your Aadhaar masking settings here. Define which parts of the Aadhaar number should be masked and how.</p>
        
//         {/* Settings content would go here */}
//         <div style={{marginTop: '20px', display: 'flex', gap: '20px'}}>
//           <div style={{flex: 1, padding: '15px', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
//             <h4>Masking Pattern</h4>
//             <p>Currently masking first 8 digits of Aadhaar numbers</p>
//           </div>
//           <div style={{flex: 1, padding: '15px', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
//             <h4>API Configuration</h4>
//             <p>Connected to central masking service</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MaskingReports = () => {
//   return (
//     <div>
//       <h2>Aadhaar Masking Reports</h2>
//       <div style={{padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
//         <h3>Monthly Statistics</h3>
//         <p>View reports and statistics for Aadhaar masking operations.</p>
        
//         {/* Report content would go here */}
//         <div style={{marginTop: '20px', display: 'flex', gap: '20px'}}>
//           <div style={{flex: 1, padding: '15px', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
//             <h4>Documents Processed</h4>
//             <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2457d3', marginTop: '10px'}}>1,245</div>
//             <p>Last 30 days</p>
//           </div>
//           <div style={{flex: 1, padding: '15px', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
//             <h4>Success Rate</h4>
//             <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2457d3', marginTop: '10px'}}>98.7%</div>
//             <p>Last 30 days</p>
//           </div>
//           <div style={{flex: 1, padding: '15px', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
//             <h4>Average Processing Time</h4>
//             <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2457d3', marginTop: '10px'}}>1.2s</div>
//             <p>Last 30 days</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;