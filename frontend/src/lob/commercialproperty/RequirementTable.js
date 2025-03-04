import React, { useState } from 'react';
import { Table, Select, Modal, Button, DatePicker, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const RequirementsTable = ({ onNext }) => {
  const [data, setData] = useState([
    {
      key: '1',
      requirementCategory: 'Medical',
      requirementSubCategory: 'Medical',
      requirement: 'ECG',
      raiseDate: moment('2024-03-01'),
      closeDate: moment('2024-03-20'),
      raisedBy: 'Somen',
      closedBy: 'Aditi',
      requirementStatus: 'Open',
      remarks: ''
    },
    {
      key: '2',
      requirementCategory: 'Non Medical',
      requirementSubCategory: 'KYC',
      requirement: 'Photo ID Proof',
      raiseDate: moment('2024-04-15'),
      closeDate: moment('2024-05-02'),
      raisedBy: 'Somen',
      closedBy: 'Somen',
      requirementStatus: 'Close',
      remarks: ''
    }
  ]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });

  const handleDropdownChange = (value, dataIndex, key, field) => {
    const newData = [...data];
    const index = newData.findIndex(item => item.key === key);
    newData[index][field] = value;
    setData(newData);
  };

  const columns = [
    {
      title: 'Requirement Category',
      dataIndex: 'requirementCategory',
      key: 'requirementCategory',
      width: 180,
      ellipsis: true,
      ...getColumnSearchProps('requirementCategory'),
      render: (text, record) => (
        <Select
          style={{ width: '100%' }}
          value={record.requirementCategory}
          onChange={(value) => handleDropdownChange(value, 'requirementCategory', record.key, 'requirementCategory')}
        >
          <Option value="Medical">Medical</Option>
          <Option value="Non Medical">Non Medical</Option>
        </Select>
      )
    },
    {
      title: 'Requirement Sub Category',
      dataIndex: 'requirementSubCategory',
      key: 'requirementSubCategory',
      width: 200,
      ellipsis: true,
      ...getColumnSearchProps('requirementSubCategory'),
      render: (text, record) => (
        <Select
          style={{ width: '100%' }}
          value={record.requirementSubCategory}
          onChange={(value) => handleDropdownChange(value, 'requirementSubCategory', record.key, 'requirementSubCategory')}
        >
          <Option value="Medical">Medical</Option>
          <Option value="KYC">KYC</Option>
          <Option value="Proposal Form Related">Proposal Form Related</Option>
          <Option value="Others">Others</Option>
        </Select>
      )
    },
    {
      title: 'Requirement',
      dataIndex: 'requirement',
      key: 'requirement',
      width: 180,
      ellipsis: true,
      ...getColumnSearchProps('requirement'),
      render: (text, record) => (
        <Select
          style={{ width: '100%' }}
          value={record.requirement}
          onChange={(value) => handleDropdownChange(value, 'requirement', record.key, 'requirement')}
        >
          <Option value="ECG">ECG</Option>
          <Option value="Pathology">Pathology</Option>
          <Option value="Photo ID Proof">Photo ID Proof</Option>
          <Option value="Bank Statement">Bank Statement</Option>
          <Option value="Address Proof">Address Proof</Option>
        </Select>
      )
    },
    {
      title: 'Raise Date',
      dataIndex: 'raiseDate',
      key: 'raiseDate',
      width: 150,
      ellipsis: true,
      render: (text, record) => (
        <DatePicker 
          value={record.raiseDate} 
          onChange={(date) => {
            const newData = [...data];
            const index = newData.findIndex(item => item.key === record.key);
            newData[index].raiseDate = date;
            setData(newData);
          }}
        />
      )
    },
    {
      title: 'Close Date',
      dataIndex: 'closeDate',
      key: 'closeDate',
      width: 150,
      ellipsis: true,
      render: (text, record) => (
        <DatePicker 
          value={record.closeDate} 
          onChange={(date) => {
            const newData = [...data];
            const index = newData.findIndex(item => item.key === record.key);
            newData[index].closeDate = date;
            setData(newData);
          }}
        />
      )
    },
    {
      title: 'Raised By',
      dataIndex: 'raisedBy',
      key: 'raisedBy',
      width: 150,
      ellipsis: true,
      ...getColumnSearchProps('raisedBy'),
      render: (text, record) => (
        <Select
          style={{ width: '100%' }}
          value={record.raisedBy}
          onChange={(value) => handleDropdownChange(value, 'raisedBy', record.key, 'raisedBy')}
        >
          <Option value="Somen">Somen</Option>
          <Option value="Kaushik">Kaushik</Option>
          <Option value="Arup">Arup</Option>
          <Option value="Aditi">Aditi</Option>
        </Select>
      )
    },
    {
      title: 'Closed By',
      dataIndex: 'closedBy',
      key: 'closedBy',
      width: 150,
      ellipsis: true,
      ...getColumnSearchProps('closedBy'),
      render: (text, record) => (
        <Select
          style={{ width: '100%' }}
          value={record.closedBy}
          onChange={(value) => handleDropdownChange(value, 'closedBy', record.key, 'closedBy')}
        >
          <Option value="Somen">Somen</Option>
          <Option value="Kaushik">Kaushik</Option>
          <Option value="Arup">Arup</Option>
          <Option value="Aditi">Aditi</Option>
        </Select>
      )
    },
    {
      title: 'Requirement Status',
      dataIndex: 'requirementStatus',
      key: 'requirementStatus',
      width: 180,
      ellipsis: true,
      ...getColumnSearchProps('requirementStatus'),
      render: (text, record) => (
        <Select
          style={{ width: '100%' }}
          value={record.requirementStatus}
          onChange={(value) => handleDropdownChange(value, 'requirementStatus', record.key, 'requirementStatus')}
        >
          <Option value="Open">Open</Option>
          <Option value="Close">Close</Option>
        </Select>
      )
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      ellipsis: true,
      render: (text, record) => text
    }
  ];

  const handleSubmit = () => {
    setSubmitModalVisible(true);
  };

  const handlePrintLetter = () => {
    setPrintModalVisible(true);
  };

  return (
    <div 
      style={{ 

        flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    margin: '30px auto',
    padding: '0 20px', /* Add padding for better spacing on smaller screens */
   
    boxShadow:' 0 2px 4px rgba(0, 0, 0, 0.8)',
       
        
      }}
    >
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={true}
        scroll={{ x: 1700 }}
        style={{ 
          width: '100%',
          tableLayout: 'auto'
        }}
        components={{
          header: {
            cell: (props) => (
              <th 
                {...props} 
                style={{ 
                  ...props.style, 
                  backgroundColor: '#76a9e0', 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontFamily: 'Arial, sans-serif',
                  padding: '8px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }} 
              />
            )
          }
        }}
      />
     
      <div 
        style={{ 
          marginTop: '40px', 
          textAlign: 'left',
          width: '100%'
        }}
      >
        <Button 
          type="primary" 
          onClick={handleSubmit} 
          style={{ marginRight: '10px' }}
        >
          Submit
        </Button>
        <Button onClick={handlePrintLetter}>
          Print Letter
        </Button>
       
      </div>
      <div 
        style={{ 
          marginTop: '10px', 
          textAlign: 'right',
          width: '100%'
        }}
      >
      <Button 
          type="primary" 
          
          style={{
            width: "10rem",
            marginBottom: "1rem",
            marginTop: "1rem",
            marginRight: "3px",
            backgroundColor: "blue",
          }}
          onClick={onNext}
        >
          Next
        </Button>
        </div>
      <Modal
        title="Submit Confirmation"
        visible={submitModalVisible}
        onOk={() => setSubmitModalVisible(false)}
        onCancel={() => setSubmitModalVisible(false)}
      >
        <p>Your requirements have been successfully submitted.</p>
        <p>Thank you for providing the details.</p>
      </Modal>

      <Modal
        title="Print Letter"
        visible={printModalVisible}
        onOk={() => setPrintModalVisible(false)}
        onCancel={() => setPrintModalVisible(false)}
      >
        <p>Preparing to print the letter...</p>
        <p>Please check your printer settings and preview.</p>
      </Modal>
    </div>
  );
};

export default RequirementsTable;