import React, { useState } from 'react';
import { Row, Col, Select, Upload, Button, Table, Card, Typography, Divider, message } from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ProposerInfoCard from './ProposerInfoCard';

const { Option } = Select;
const { Title } = Typography;

const FinancialAnalysis = () => {
  // Sample data from CreateSubmission component
  const sampleProposerData = {
    salutation: "Mr",
    clientId: "6578903",
    firstName: "Abhishek",
    middleName: "Kumar",
    lastName: "Singh",
    dob: "7/4/1997",
    gender: "Male",
    occupation: "Software Engineer",
    education: "Graduate",
    annualIncome: "770,000"
  };

  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedIIBFile, setSelectedIIBFile] = useState(null);
  const [incomeDocUploaded, setIncomeDocUploaded] = useState(false);
  const [iibFileUploaded, setIibFileUploaded] = useState(false);

  // Form 16/ITR Financial table columns and data
  const form16ItrColumns = [
    { title: '', dataIndex: 'description', key: 'description' },
    { title: 'FY19-20', dataIndex: 'fy1920', key: 'fy1920' },
    { title: 'FY21-22', dataIndex: 'fy2122', key: 'fy2122' },
    { title: 'FY22-23', dataIndex: 'fy2223', key: 'fy2223' },
    { title: '3 Years Average', dataIndex: 'average', key: 'average' },
    { title: 'SAMF', dataIndex: 'samf', key: 'samf' },
    { title: 'SA Eligibility', dataIndex: 'saEligibility', key: 'saEligibility' },
  ];

  const form16ItrData = [
    {
      key: '1',
      description: 'Form 16/ITR',
      fy1920: 720000,
      fy2122: 735000,
      fy2223: 756000,
      average: 737000,
      samf: 25,
      saEligibility: 18425000,
    },
    {
      key: '2',
      description: 'Existing Insurance - IIB',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 5500000,
    },
    {
      key: '3',
      description: 'Existing Insurance - Kotak',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 500000,
    },
    {
      key: '4',
      description: 'Total Existing Insurance',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 6000000,
    },
    {
      key: '5',
      description: 'Eligible Cover for this policy',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 12425000,
    },
    {
      key: '6',
      description: 'Coverage applied in this policy',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 8000000,
    },
    {
      key: '7',
      description: 'Over/Under Insured',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 4425000,
    },
  ];

  // Salary Slip Document details table columns and data
  const salarySlipColumns = [
    { title: 'Documents', dataIndex: 'document', key: 'document' },
    { title: 'Jan-25', dataIndex: 'jan', key: 'jan' },
    { title: 'Feb-25', dataIndex: 'feb', key: 'feb' },
    { title: 'Mar-25', dataIndex: 'mar', key: 'mar' },
    { title: 'Annual/Estimated Annual', dataIndex: 'annual', key: 'annual' },
    { title: 'SAMF', dataIndex: 'samf', key: 'samf' },
    { title: 'SA Eligibility', dataIndex: 'saEligibility', key: 'saEligibility' },
  ];

  const salarySlipData = [
    {
      key: '1',
      document: 'Salary Slips (Gross)',
      jan: 63000,
      feb: 63000,
      mar: 63000,
      annual: 756000,
      samf: 25,
      saEligibility: '',
    },
    {
      key: '2',
      document: 'Salary Slips (Net)',
      jan: 55000,
      feb: 55000,
      mar: 49000,
      annual: 636000,
      samf: '',
      saEligibility: '',
    },
    {
      key: '3',
      document: 'Bank Credits',
      jan: 50000,
      feb: 55000,
      mar: 49000,
      annual: 616000,
      samf: '',
      saEligibility: '',
    },
    {
      key: '4',
      document: 'Existing Insurance - IIB',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: 5500000,
    },
    {
      key: '5',
      document: 'Existing Insurance - Kotak',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: 500000,
    },
    {
      key: '6',
      document: 'Total Existing Insurance',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: 6000000,
    },
    {
      key: '7',
      document: 'Eligible Cover for this policy',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: '',
    },
    {
      key: '8',
      document: 'Coverage applied in this policy',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: '',
    },
    {
      key: '9',
      document: 'Over/Under Insured',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: '',
    },
  ];

  const handleIncomeDocUpload = info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} uploaded successfully`);
      setIncomeDocUploaded(true);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  const handleIIBFileUpload = info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} uploaded successfully`);
      setIibFileUploaded(true);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  // Determine which table to show based on selected document types and upload status
  const showTable = () => {
    if (incomeDocUploaded ) {
      if (selectedDocType === 'form16' || selectedDocType === 'itr') {
        return (
          <Card 
            title={<Title level={4}>Annual Income-Based Financial Underwriting</Title>} 
            bordered={true} 
            style={{ marginBottom: '20px' }}
          >
            <Table 
              columns={form16ItrColumns} 
              dataSource={form16ItrData} 
              pagination={false}
              bordered
              size="middle"
            />
          </Card>
        );
      } else if (selectedDocType === 'salary' || selectedDocType === 'bankaccount') {
        return (
          <Card 
            title={<Title level={4}>Monthly Income-Based Financial Underwriting</Title>} 
            bordered={true} 
            style={{ marginBottom: '20px' }}
          >
            <Table 
              columns={salarySlipColumns} 
              dataSource={salarySlipData} 
              pagination={false}
              bordered
              size="middle"
            />
          </Card>
        );
      }
    }
    return null;
  };

  return (
    <div style={{ 
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'center',
      margin: '30px auto',
      padding: '0 20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProposerInfoCard proposerData={sampleProposerData} />
        </Col>
      </Row>

      {/* Document Upload Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} md={12}>
          <Card title="Select & Upload Income Document" bordered={true}>
            <Row gutter={[8, 8]} align="middle">
              <Col xs={16} sm={18}>
                <Select
                  placeholder="Select Income Document Type"
                  style={{ width: '100%' }}
                  onChange={(value) => {
                    setSelectedDocType(value);
                    setIncomeDocUploaded(false); // Reset upload status when selection changes
                  }}
                >
                  <Option value="form16">Form 16</Option>
                  <Option value="itr">ITR File</Option>
                  <Option value="bankaccount">Bank Account Statement</Option>
                  <Option value="salary">Salary Slip</Option>
                </Select>
              </Col>
              <Col xs={8} sm={6}>
                <Upload 
                  customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 500)}
                  onChange={handleIncomeDocUpload}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    disabled={!selectedDocType}
                    title={selectedDocType ? `Upload ${selectedDocType}` : "Select document type first"}
                  >
                    Upload
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Card>
        </Col>
        {/* <Col xs={24} md={12}>
          <Card title="Select & Upload IIB Details" bordered={true}>
            <Row gutter={[8, 8]} align="middle">
              <Col xs={16} sm={18}>
                <Select
                  placeholder="Select IIB File"
                  style={{ width: '100%' }}
                  onChange={(value) => {
                    setSelectedIIBFile(value);
                    setIibFileUploaded(false); // Reset upload status when selection changes
                  }}
                >
                  <Option value="iib">IIB File</Option>
                </Select>
              </Col>
              <Col xs={8} sm={6}>
                <Upload 
                  customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 500)}
                  onChange={handleIIBFileUpload}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    disabled={!selectedIIBFile}
                    title={selectedIIBFile ? "Upload IIB File" : "Select IIB file first"}
                  >
                    Upload
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Card>
        </Col> */}
      </Row>

      {/* Conditionally render the appropriate table */}
      {showTable()}
    </div>
  );
};

export default FinancialAnalysis;