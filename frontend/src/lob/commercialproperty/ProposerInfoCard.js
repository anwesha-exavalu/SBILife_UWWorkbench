import React, { useEffect, useState } from 'react';
import { Card, Avatar, Descriptions, Row, Col, Typography } from 'antd';
import { UserOutlined, BookOutlined, DollarOutlined, CalendarOutlined, TeamOutlined, ToolOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProposerInfoCard = ({ proposerData }) => {
  const [age, setAge] = useState(null);
  
  // Calculate age based on date of birth
  useEffect(() => {
    if (proposerData?.dob) {
      const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        
        return calculatedAge;
      };
      
      setAge(calculateAge(proposerData.dob));
    }
  }, [proposerData?.dob]);

  // If no data is provided, show loading or empty state
  if (!proposerData) {
    return (
      <Card loading style={{ width: '100%', marginBottom: '20px' }} />
    );
  }

  const fullName = `${proposerData.salutation || ''} ${proposerData.firstName || ''} ${proposerData.middleName || ''} ${proposerData.lastName || ''}`.trim();

  return (
    <Card 
      title={<Title level={4}>Proposer Summary</Title>}
      style={{ 
        width: '100%', 
        marginBottom: '20px',
        marginTop:'20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px'
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={8} md={6} lg={5} xl={4}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar 
              size={100} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: '#1890ff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '42px'
              }}
            />
          </div>
        </Col>
        
        <Col xs={24} sm={16} md={18} lg={19} xl={20}>
          <Descriptions 
            bordered 
            column={{ xs: 1, sm: 1, md: 2, lg: 2 }}
            size="small"
            style={{ width: '100%' }}
          >
            <Descriptions.Item 
              label={<Text strong><UserOutlined /> Full Name</Text>} 
              span={2}
            >
              {fullName || 'N/A'}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<Text strong><CalendarOutlined /> Age</Text>}
            >
              {age ? `${age} years` : 'N/A'}
              <Text type="secondary" style={{ marginLeft: '8px' }}>
                (DOB: {proposerData.dob || 'N/A'})
              </Text>
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<Text strong><TeamOutlined /> Gender</Text>}
            >
              {proposerData.gender || 'N/A'}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<Text strong><ToolOutlined /> Occupation</Text>}
            >
              {proposerData.occupation || 'N/A'}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<Text strong><BookOutlined /> Education</Text>}
            >
              {proposerData.education || 'N/A'}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<Text strong><DollarOutlined /> Annual Income</Text>} 
              span={2}
            >
              {proposerData.annualIncome || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default ProposerInfoCard;