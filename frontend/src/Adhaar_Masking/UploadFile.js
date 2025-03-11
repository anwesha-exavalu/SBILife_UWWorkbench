import React, { useState } from 'react';
import { 
  Upload, 
  message, 
  Alert,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './BulkMasking.css';
import styled from 'styled-components';

const MethodContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  background: white;
  max-width: 500px;
  width: 100%;
  transition: all 0.3s;
  
  &.selected {
    border: 2px solid #1677FF;
    background: #f0f7ff;
  }
`;

const UploadFile = () => {
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return false;
  };

  const handleFileChange = async (info) => {
    const { fileList: newFileList, file } = info;
    
    if (file.status === 'removed') {
      setFileList([]);
      setImageUrl(null);
      message.warning('File removed');
      return;
    }

    setFileList(newFileList);

    if (newFileList.length > 0) {
      const currentFile = newFileList[0].originFileObj;
      
      if (currentFile) {
        try {
          const reader = new FileReader();
          reader.onload = () => {
            setImageUrl(reader.result);
            message.success('File uploaded successfully');
          };
          reader.onerror = () => {
            message.error('Error reading file');
          };
          reader.readAsDataURL(currentFile);
        } catch (error) {
          message.error('Error processing file');
          console.error('File processing error:', error);
        }
      }
    }
  };

  const handleNext = () => {
    if (fileList.length > 0 && imageUrl) {
      navigate('/secondScreen', { 
        state: { 
          uploadedImage: imageUrl
        }
      });
    } else {
      message.error('Please upload an image first');
    }
  };

  return (
    <div className="container" style={{ justifyContent: 'center', padding: '40px' }}>
      <MethodContainer>
        <h2 className="title">Upload Your Aadhaar Card</h2>
        <div className="upload-box">
          <p className="file-inside">Select or drop your file here (.jpg, .jpeg, .png)</p>
          <Upload
            accept=".jpg,.jpeg,.png"
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
            fileList={fileList}
            maxCount={1}
          >
            <button
              type='default'
              className="button"
              color='#1677FF' 
            >
             <UploadOutlined /> 
            </button>
          </Upload>
        </div>
        
        {fileList.length > 0 && imageUrl && (
          <Alert
            message="File selected successfully"
            type="success"
            showIcon
            style={{ marginTop: '16px', width: '100%' }}
          />
        )}
        
        <button
          className="continue-button"
          onClick={handleNext}
          disabled={!fileList.length || !imageUrl}
          style={{ marginTop: '24px', width: '100%' }}
        >
          Continue to Next Step
        </button>
      </MethodContainer>
    </div>
  );
};

export default UploadFile;