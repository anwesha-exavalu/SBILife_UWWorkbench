import React, { useState } from 'react';
import { Row, Col, Select, Upload, Button, Table, Card, Typography, message } from 'antd';
import { UploadOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import ProposerInfoCard from './ProposerInfoCard';
import axios from 'axios';

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
    annualIncome: "770,000",
    customerID: "20967",
    panNumber: "XXXXXXXXXX", // Added PAN number for matching
    companyName: "ABC SUPPORT SERVICES INDIA PRIVATE LIMITED" // Added company name for matching
  };

  const [selectedDocType, setSelectedDocType] = useState(null);
  const [incomeDocUploaded, setIncomeDocUploaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiResponseData, setApiResponseData] = useState(null);
  const [matchingResults, setMatchingResults] = useState({
    companyName: { matched: false, checked: false },
    employeeName: { matched: false, checked: false },
    panNumber: { matched: false, checked: false },
    grossSalary: { matched: false, checked: false },
    insuranceDeductions: { matched: false, checked: false }
  });

  // Form 16/ITR Financial table columns
  const form16ItrColumns = [
    { title: '', dataIndex: 'description', key: 'description' },
    { title: 'FY19-20', dataIndex: 'fy1920', key: 'fy1920' },
    { title: 'FY20-21', dataIndex: 'fy2122', key: 'fy2122' },
    { title: 'FY21-22', dataIndex: 'fy2223', key: 'fy2223' },
    { title: '3 Years Average', dataIndex: 'average', key: 'average' },
    { title: 'SAMF', dataIndex: 'samf', key: 'samf' },
    { title: 'SA Eligibility', dataIndex: 'saEligibility', key: 'saEligibility' },
  ];

  // Salary Slip Document details table columns
  const salarySlipColumns = [
    { title: 'Documents', dataIndex: 'document', key: 'document' },
    { title: 'Jan-25', dataIndex: 'jan', key: 'jan' },
    { title: 'Feb-25', dataIndex: 'feb', key: 'feb' },
    { title: 'Mar-25', dataIndex: 'mar', key: 'mar' },
    { title: 'Annual/Estimated Annual', dataIndex: 'annual', key: 'annual' },
    { title: 'SAMF', dataIndex: 'samf', key: 'samf' },
    { title: 'SA Eligibility', dataIndex: 'saEligibility', key: 'saEligibility' },
  ];

  // SAMF calculation based on age
  const calculateSAMF = (age) => {
    if (age >= 18 && age <= 35) return 30;
    if (age >= 36 && age <= 40) return 25;
    if (age >= 41 && age <= 50) return 20;
    if (age >= 51 && age <= 60) return 10;
    if (age > 60) return "UW Discretion";
    return 0; // Default case
  };

  // Calculate age based on DOB
  const calculateAge = (dob) => {
    if (!dob) return 0;

    const dobParts = dob.split('/');
    if (dobParts.length !== 3) return 0;

    const birthDate = new Date(
      parseInt(dobParts[2]),
      parseInt(dobParts[1]) - 1,
      parseInt(dobParts[0])
    );

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Default data structures for different document types
  const defaultForm16Data = [
    {
      key: '1',
      description: 'Form 16/ITR',
      fy1920: 0,
      fy2122: 0,
      fy2223: 0,
      average: 0,
      samf: 0,
      saEligibility: 0,
    },
    {
      key: '2',
      description: 'Existing Insurance - IIB',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 0,
    },
    {
      key: '3',
      description: 'Existing Insurance - Kotak',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 0,
    },
    {
      key: '4',
      description: 'Total Existing Insurance',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 0,
    },
    {
      key: '5',
      description: 'Eligible Cover for this policy',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 0,
    },
    {
      key: '6',
      description: 'Coverage applied in this policy',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 0,
    },
    {
      key: '7',
      description: 'Over/Under Insured',
      fy1920: null,
      fy2122: null,
      fy2223: null,
      average: null,
      samf: null,
      saEligibility: 0,
    },
  ];

  const defaultSalaryData = [
    {
      key: '1',
      document: 'Salary Slips (Gross)',
      jan: 5234,
      feb: 5236,
      mar: 7656,
      annual: 0,
      samf: 0,
      saEligibility: '',
    },
    {
      key: '2',
      document: 'Salary Slips (Net)',
      jan: 0,
      feb: 0,
      mar: 0,
      annual: 0,
      samf: '',
      saEligibility: '',
    },
    {
      key: '3',
      document: 'Bank Credits',
      jan: 0,
      feb: 0,
      mar: 0,
      annual: 0,
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
      saEligibility: 0,
    },
    {
      key: '5',
      document: 'Existing Insurance - Kotak',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: 0,
    },
    {
      key: '6',
      document: 'Total Existing Insurance',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: 0,
    },
    {
      key: '7',
      document: 'Eligible Cover for this policy',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: 0,
    },
    {
      key: '8',
      document: 'Coverage applied in this policy',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: 0,
    },
    {
      key: '9',
      document: 'Over/Under Insured',
      jan: null,
      feb: null,
      mar: null,
      annual: null,
      samf: null,
      saEligibility: 0,
    },
  ];

  // Check if document data matches with proposal data
  const checkDataMatching = (apiResponse) => {
    if (!apiResponse?.response) return;

    const response = apiResponse.response;
    const newMatchingResults = { ...matchingResults };

    // Check Company Name
    if (response["Company Name"]) {
      newMatchingResults.companyName = {
        checked: true,
        matched: response["Company Name"].includes(sampleProposerData.companyName)
      };
    }

    // Check Employee Name
    if (response["Employee Name"]) {
      const fullName = `${sampleProposerData.firstName} ${sampleProposerData.middleName} ${sampleProposerData.lastName}`.trim();
      newMatchingResults.employeeName = {
        checked: true,
        matched: response["Employee Name"].includes(fullName) || fullName.includes(response["Employee Name"])
      };
    }

    // Check PAN Number
    if (response["PAN Number"]) {
      newMatchingResults.panNumber = {
        checked: true,
        matched: response["PAN Number"] === sampleProposerData.panNumber
      };
    }

    // Check Gross Salary
    if (response["Gross Salary"]) {
      const documentGrossSalary = parseFloat(response["Gross Salary"]);
      const proposalGrossSalary = parseFloat(sampleProposerData.annualIncome.replace(/,/g, ''));

      // Consider a match if they are within 10% of each other
      const tolerance = 0.1; // 10%
      const difference = Math.abs(documentGrossSalary - proposalGrossSalary);
      const percentDifference = difference / proposalGrossSalary;

      newMatchingResults.grossSalary = {
        checked: true,
        matched: percentDifference <= tolerance
      };
    }

    // Check Insurance Deductions if available
    if (response["Insurance Premium Deductions"]) {
      // For demo purposes, we'll just mark it as checked but not matched
      newMatchingResults.insuranceDeductions = {
        checked: true,
        matched: false // In a real app, you would compare with actual insurance data
      };
    }

    setMatchingResults(newMatchingResults);
  };

  // Function to parse the API response and update table data
 // Update the updateTableWithApiData function to handle bank statement data
const updateTableWithApiData = (apiResponse) => {
  // Store API response for reference
  setApiResponseData(apiResponse);
  
  // Check if document data matches with proposal data
  checkDataMatching(apiResponse);
  
  // Calculate proposer's age based on DOB
  const age = calculateAge(sampleProposerData.dob);
  const samf = calculateSAMF(age);
  
  if (selectedDocType === 'form16' || selectedDocType === 'itr') {
    // Create a new array based on default structure
    const updatedData = [...defaultForm16Data];
    
    // Initialize values
    let fy1920 = 0;
    let fy2122 = 0;
    let fy2223 = 0;


    
    // Check if we have response data and map it to the correct fiscal year
    if (apiResponse?.response) {
      const grossSalary = parseFloat(apiResponse.response["Gross Salary"] || 0);
      const fiscalYear = apiResponse.response["FY"] || "";
      
      // Map the gross salary to the corresponding fiscal year column
      if (fiscalYear === "2019-20") {
        fy1920 = grossSalary;
      } else if (fiscalYear === "2021-22") {
        fy2122 = grossSalary;
      } else if (fiscalYear === "2022-23") {
        fy2223 = grossSalary;
      }
    }
    
    // For this example, let's assume we have some previous data for other fiscal years
    // In a real application, you would maintain this state or get it from another API
    if (fy1920 === 0) fy1920 = 123000; // Example value if not provided
    if (fy2122 === 0) fy2122 = 187000; // Example value if not provided
    if (fy2223 === 0) fy2223 = 256000; // Example value if not provided
    
    // Calculate 3-year average
    const average = Math.round((fy1920 + fy2122 + fy2223) / 3);
    
    // Calculate SA Eligibility (Average Income * SAMF)
    const saEligibility = typeof samf === 'number' ? Math.round(average * samf) : 0;
    
    // Update the first row with calculated data
    updatedData[0] = {
      ...updatedData[0],
      fy1920,
      fy2122,
      fy2223,
      average,
      samf,
      saEligibility,
    };
    
    // Set existing insurance values from API or use defaults
    const iibInsurance = 2000000; // Default or from API
    const kotakInsurance = 500000; // Default or from API
    const totalExistingInsurance = iibInsurance + kotakInsurance;
    
    // Update existing insurance rows
    updatedData[1] = {
      ...updatedData[1],
      saEligibility: iibInsurance,
    };
    
    updatedData[2] = {
      ...updatedData[2],
      saEligibility: kotakInsurance,
    };
    
    updatedData[3] = {
      ...updatedData[3],
      saEligibility: totalExistingInsurance,
    };
    
    // Calculate eligible cover for this policy
    const eligibleCover = saEligibility - totalExistingInsurance;
    updatedData[4] = {
      ...updatedData[4],
      saEligibility: eligibleCover,
    };
    
    // Set coverage applied in this policy (from API or default)
    const coverageApplied = 2500000; // Default or from API
    updatedData[5] = {
      ...updatedData[5],
      saEligibility: coverageApplied,
    };
    
    // Calculate over/under insured
    const overUnderInsured = eligibleCover - coverageApplied;
    updatedData[6] = {
      ...updatedData[6],
      saEligibility: overUnderInsured,
    };
    
    setTableData(updatedData);
  } else if (selectedDocType === 'salary' || selectedDocType === 'bankaccount') {
    // Handle salary/bank statement data
    const updatedData = [...defaultSalaryData];
    
    // Get monthly values from API response or use defaults
    let jan = 0;
    let feb = 0;
    let mar = 0;

    console.log("Api response: ", apiResponse);
    
    if (apiResponse?.response) {
      // Try to parse values from the API response
      try {
        // The response is a string containing JSON data
        // Extract and parse the JSON string from the response
        let dataArray = [];
        
        if (typeof apiResponse.response === 'string') {
          // Extract JSON array from the response string
          const jsonMatch = apiResponse.response.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            dataArray = JSON.parse(jsonMatch[1]);
          }
        } else if (Array.isArray(apiResponse.response)) {
          dataArray = apiResponse.response;
        }
        
        // Map the data to the corresponding months
        if (dataArray.length >= 1) {
          // Apr 8 maps to January
          jan = parseFloat(dataArray[0].balance.replace(/,/g, '') || "0");
        }
        if (dataArray.length >= 2) {
          // Apr 10 maps to February
          feb = parseFloat(dataArray[1].balance.replace(/,/g, '') || "0");
        }
        if (dataArray.length >= 3) {
          // Apr 12 maps to March
          mar = parseFloat(dataArray[2].balance.replace(/,/g, '') || "0");
        }
      } catch (error) {
        console.error("Error parsing monthly values:", error);
        // Use default values if parsing fails
        jan = selectedDocType === 'salary' ? 63000 : 5234;
        feb = selectedDocType === 'salary' ? 63000 : 5236;
        mar = selectedDocType === 'salary' ? 63000 : 7656;
      }
    } else {
      // Use default values if API doesn't return valid data
      jan = selectedDocType === 'salary' ? 63000 : 5234;
      feb = selectedDocType === 'salary' ? 63000 : 5236;
      mar = selectedDocType === 'salary' ? 63000 : 7656;
    }
    
    // Calculate annual income (monthly * 12)

    const avgMonthly = (jan + feb + mar) / 3;
    console.log("avg",avgMonthly)
    const annual = Math.round(avgMonthly * 12);
    
    // Calculate SA Eligibility
    const saEligibility = typeof samf === 'number' ? Math.round(annual * samf) : 0;
    
    // Update salary slips (gross) row
    updatedData[0] = {
      ...updatedData[0],
      jan,
      feb,
      mar,
      annual,
      samf,
      saEligibility,
    };
    
    // Set existing insurance values
    const iibInsurance = 5500000;
    const kotakInsurance = 500000;
    const totalExistingInsurance = iibInsurance + kotakInsurance;
    
    // Update existing insurance rows
    updatedData[3] = {
      ...updatedData[3],
      saEligibility: iibInsurance,
    };
    
    updatedData[4] = {
      ...updatedData[4],
      saEligibility: kotakInsurance,
    };
    
    updatedData[5] = {
      ...updatedData[5],
      saEligibility: totalExistingInsurance,
    };
    
    // Calculate eligible cover for this policy
    const eligibleCover = saEligibility - totalExistingInsurance;
    updatedData[6] = {
      ...updatedData[6],
      saEligibility: eligibleCover,
    };
    
    // Set coverage applied in this policy
    const coverageApplied = 8000000;
    updatedData[7] = {
      ...updatedData[7],
      saEligibility: coverageApplied,
    };
    
    // Calculate over/under insured
    const overUnderInsured = eligibleCover - coverageApplied;
    updatedData[8] = {
      ...updatedData[8],
      saEligibility: overUnderInsured,
    };
    
    setTableData(updatedData);
  }
};
  // Custom request handler for file upload
  const customUploadRequest = async ({ file, onSuccess, onError }) => {
    setLoading(true);
  
    const formData = new FormData();
    formData.append('file', file);
  
    // Set API endpoint based on document type
    let apiEndpoint = '';
    if (selectedDocType === 'form16') {
      apiEndpoint = 'http://127.0.0.1:8000/extract_data/form16';
    } else if (selectedDocType === 'bankaccount') {
      apiEndpoint = 'http://127.0.0.1:8000/extract_data/bankstatement';
    } else if (selectedDocType === 'itr') {
      apiEndpoint = 'http://127.0.0.1:8000/extract_data/itr';
    } else if (selectedDocType === 'salary') {
      apiEndpoint = 'http://127.0.0.1:8000/extract_data/salary';
    } else {
      apiEndpoint = 'http://127.0.0.1:8000/extract_data/';
    }
  
    try {
      // Only form16 was going through the API path, now all document types will
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Handle successful response
      if (response.data) {
        console.log(response.data);
        updateTableWithApiData(response.data);
        onSuccess('ok');
        setIncomeDocUploaded(true);
        message.success(`${file.name} processed successfully`);
      } else {
        onError('Failed to process the file');
        message.error('Failed to extract data from file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      onError('Failed to upload file');
      message.error(`${file.name} upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format number as currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    return value.toLocaleString('en-IN');
  };

  // Render matching status icon
  const renderMatchingStatus = (field) => {
    const result = matchingResults[field];

    if (!result.checked) {
      return <span style={{ color: '#999' }}>-</span>;
    } else if (result.matched) {
      return <CheckCircleFilled style={{ color: '#52c41a', fontSize: '16px' }} />;
    } else {
      return <CloseCircleFilled style={{ color: '#f5222d', fontSize: '16px' }} />;
    }
  };

  // Get matching data for table display
  const getMatchingTableData = () => {
    return [
      {
        key: 'companyName',
        field: 'Company Name',
        requirement: 'Matches with Salary Slip/Proposal Form',
        status: renderMatchingStatus('companyName')
      },
      {
        key: 'employeeName',
        field: 'Employee Name',
        requirement: 'Matches with Salary Slip/Proposal Form',
        status: renderMatchingStatus('employeeName')
      },
      {
        key: 'panNumber',
        field: 'PAN Number',
        requirement: 'Matches with PAN Document',
        status: renderMatchingStatus('panNumber')
      },
      {
        key: 'grossSalary',
        field: 'Gross Salary',
        requirement: 'To check if gross Salary is available',
        status: renderMatchingStatus('grossSalary')
      },
      {
        key: 'insuranceDeductions',
        field: 'Insurance Deductions',
        requirement: 'Check for deductions for Insurance',
        status: renderMatchingStatus('insuranceDeductions')
      }
    ];
  };

  // Determine which table to show based on selected document types and upload status
  const showTable = () => {
    if (incomeDocUploaded) {
      if (selectedDocType === 'form16' || selectedDocType === 'itr') {
        return (
          <Card
            title={
              <div>
                <Title level={4}>Annual Income-Based Financial Underwriting</Title>
                {apiResponseData?.response && (
                  <div style={{ fontSize: '14px', marginTop: '8px' }}>
                    <p>
                      <strong>Company:</strong> {apiResponseData.response["Company Name"] || 'N/A'} |
                      <strong> Employee:</strong> {apiResponseData.response["Employee Name"] || 'N/A'} |
                      <strong> PAN:</strong> {apiResponseData.response["PAN Number"] || 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            }
            bordered={true}
            style={{ marginBottom: '20px' }}
          >
            <Table
              columns={form16ItrColumns.map(col => {
                if (['fy1920', 'fy2122', 'fy2223', 'average', 'saEligibility'].includes(col.dataIndex)) {
                  return {
                    ...col,
                    render: (text) => formatCurrency(text)
                  };
                }
                return col;
              })}
              dataSource={tableData}
              pagination={false}
              bordered
              size="middle"
              loading={loading}
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
              columns={salarySlipColumns.map(col => {
                if (['jan', 'feb', 'mar', 'annual', 'saEligibility'].includes(col.dataIndex)) {
                  return {
                    ...col,
                    render: (text) => formatCurrency(text)
                  };
                }
                return col;
              })}
              dataSource={tableData}
              pagination={false}
              bordered
              size="middle"
              loading={loading}
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
                    setTableData([]); // Clear table data
                    setApiResponseData(null); // Clear API response data
                    // Reset matching results
                    setMatchingResults({
                      companyName: { matched: false, checked: false },
                      employeeName: { matched: false, checked: false },
                      panNumber: { matched: false, checked: false },
                      grossSalary: { matched: false, checked: false },
                      insuranceDeductions: { matched: false, checked: false }
                    });
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
                  customRequest={customUploadRequest}
                  multiple
                  showUploadList={true}
                >
                  <Button
                    icon={<UploadOutlined />}
                    disabled={!selectedDocType}
                    loading={loading}
                    title={selectedDocType ? `Upload ${selectedDocType}` : "Select document type first"}
                  >
                    Upload
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Matching Section - only show after form16 document is uploaded */}
        <Col xs={24} md={12}>
          <Card title="Document Matching Status" bordered={true}>
            {incomeDocUploaded && (selectedDocType === 'form16' || selectedDocType === 'itr') ? (
              <Table
                size="small"
                pagination={false}
                showHeader={false}
                bordered
                dataSource={getMatchingTableData()}
                columns={[
                  { title: 'Field', dataIndex: 'field', key: 'field', width: '25%' },
                  { title: 'Requirement', dataIndex: 'requirement', key: 'requirement', width: '65%' },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: '10%',
                    align: 'center'
                  }
                ]}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                {selectedDocType === 'form16' || selectedDocType === 'itr' ?
                  'Upload a Form 16 or ITR document to view matching status' :
                  'Select and upload Form 16 or ITR document to view matching status'}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Conditionally render the appropriate table */}
      {showTable()}
    </div>
  );
};

export default FinancialAnalysis;