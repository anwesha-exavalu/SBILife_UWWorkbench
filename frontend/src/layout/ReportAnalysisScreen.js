import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Button,
  Card,
  Radio,
  Slider,
  Select,
  Row,
  Col,
  message,
  Divider,
  Typography,
  Image,
  Space,
  Modal,
  Form,
  Input
} from 'antd';
import {
  UploadOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  DownloadOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import styles from "./ReportAnalysisScreen.module.css"

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ECGAnalysis = () => {
  // States for the component
  const [fileList, setFileList] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [rotatedPreview, setRotatedPreview] = useState(null);
  const [rotateOption, setRotateOption] = useState('No');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoomFactor, setZoomFactor] = useState(2);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState(null);
  const [outputPdfUrl, setOutputPdfUrl] = useState(null);
  const [pageRotationInfo, setPageRotationInfo] = useState([]);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [pdfDocData, setPdfDocData] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [responsePdfDocument, setResponsePdfDocument] = useState(null);
  const [responsePdfPreview, setResponsePdfPreview] = useState(null);
  const [modelResponse, setModelResponse] = useState('');
  const canvasRef = useRef(null);
  const rotatedCanvasRef = useRef(null);
  const responsePdfCanvasRef = useRef(null);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isReferModalVisible, setIsReferModalVisible] = useState(false);


  // Load PDF.js library from CDN
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // We're using a global variable approach instead of imports
        if (!window.pdfjsLib) {
          // Load PDF.js main library
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
          script.async = true;

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });

          // Set worker location
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        }

        setPdfJsLoaded(true);
      } catch (error) {
        console.error('Failed to load PDF.js:', error);
        message.error('Failed to load PDF processing library. Please try again later.');
      }
    };

    loadPdfJs();
  }, []);

  // Handle file upload
  const handleFileUpload = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const file = fileList[0].originFileObj;
      // Check if PDF.js is loaded
      if (pdfJsLoaded) {
        // Create a preview of the PDF's first page
        loadPdfAndGeneratePreview(file);
      } else {
        message.warning('PDF processing library is still loading. Please try again in a moment.');
      }
    } else {
      setPdfPreview(null);
      setRotatedPreview(null);
      setPageRotationInfo([]);
      setPdfDocData(null);
      setPdfDocument(null);
      setOutputPdfUrl(null);
      setModelResponse('');
      setResponsePdfDocument(null);
      setResponsePdfPreview(null);
    }
  };

  // Load PDF and generate preview
  const loadPdfAndGeneratePreview = async (file) => {
    try {
      setLoading(true);

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      setPdfDocData(arrayBuffer);

      // Load PDF document using PDF.js
      const loadingTask = window.pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      setPdfDocument(pdf);

      // Get PDF rotation info
      const rotationInfo = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        rotationInfo.push({
          page: i,
          angle: page.rotate || 0
        });
      }
      setPageRotationInfo(rotationInfo);

      // Render the first page as preview
      await renderPdfPage(pdf, 1, canvasRef, false);

      setLoading(false);
    } catch (error) {
      console.error('Error loading PDF:', error);
      message.error('Error loading PDF: ' + error.message);
      setLoading(false);
    }
  };

  // Render a PDF page to a canvas
  const renderPdfPage = async (pdf, pageNum, canvasRef, rotate) => {
    // Ensure we have a valid canvas and PDF
    if (!pdf || !canvasRef.current) {
      console.error('Invalid PDF or canvas reference');
      return null;
    }

    try {
      // Cancel any ongoing render tasks
      if (canvasRef.current.renderTask) {
        try {
          await canvasRef.current.renderTask.cancel();
        } catch (cancelError) {
          console.warn('Previous render task cancellation:', cancelError);
        }
      }

      // Get the page
      const page = await pdf.getPage(pageNum);

      // Determine viewport
      const viewport = page.getViewport({
        scale: zoomFactor,
        rotation: rotate ? parseInt(rotationAngle) : 0
      });

      // Get canvas and context
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Clear previous content
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Set canvas dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page with a new render task
      const renderTask = page.render({
        canvasContext: context,
        viewport: viewport
      });

      // Store the render task on the canvas for potential cancellation
      canvasRef.current.renderTask = renderTask;

      // Wait for rendering to complete
      await renderTask.promise;

      // Convert canvas to base64 image data URL
      const imageUrl = canvas.toDataURL('image/jpeg');

      // Set the appropriate preview state
      if (rotate) {
        setRotatedPreview(imageUrl);
      } else if (canvasRef === responsePdfCanvasRef) {
        setResponsePdfPreview(imageUrl);
      } else {
        setPdfPreview(imageUrl);
      }

      return imageUrl;
    } catch (error) {
      // More detailed error handling
      if (error.name === 'RenderingCancelledException') {
        console.warn('PDF rendering was cancelled');
        return null;
      }

      console.error('Error rendering PDF page:', error);
      message.error(`Error rendering PDF: ${error.message}`);
      return null;
    } finally {
      // Ensure render task is cleared
      if (canvasRef.current) {
        canvasRef.current.renderTask = null;
      }
    }
  };


  // Load and render response PDF
  const loadResponsePdf = async (url) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();

      // Load PDF document
      const loadingTask = window.pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      setResponsePdfDocument(pdf);

      // Check if the PDF has at least 2 pages
      if (pdf.numPages >= 2) {
        // Render the second page
        await renderPdfPage(pdf, 2, responsePdfCanvasRef, false);
      } else {
        message.info('The response PDF has only one page.');
        // Render the first page if second page is not available
        await renderPdfPage(pdf, 1, responsePdfCanvasRef, false);
      }
    } catch (error) {
      console.error('Error loading response PDF:', error);
      message.error('Error loading response PDF: ' + error.message);
    }
  };

  // Re-render both normal and rotated preview when zoom changes
  useEffect(() => {
    let isMounted = true;

    const updatePreviews = async () => {
      try {
        if (pdfDocument && isMounted) {
          // Update normal preview with new zoom
          await renderPdfPage(pdfDocument, 1, canvasRef, false);

          // Update rotated preview if needed
          if (rotateOption === 'Yes' && isMounted) {
            await renderPdfPage(pdfDocument, 1, rotatedCanvasRef, true);
          }

          // Update response PDF preview if available
          if (responsePdfDocument && isMounted) {
            const pageNum = responsePdfDocument.numPages >= 2 ? 2 : 1;
            await renderPdfPage(responsePdfDocument, pageNum, responsePdfCanvasRef, false);
          }
        }
      } catch (error) {
        console.error('Preview update error:', error);
      }
    };

    updatePreviews();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [zoomFactor, pdfDocument, responsePdfDocument, rotateOption, rotationAngle]);

  // Handle rotate PDF
  const handleRotate = async () => {
    if (!pdfDocument) {
      message.error('Please upload a PDF first');
      return;
    }

    setLoading(true);

    try {
      // Render the rotated page
      await renderPdfPage(pdfDocument, 1, rotatedCanvasRef, true);

      // Create a blob URL for download simulation
      const blob = new Blob([pdfDocData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setRotatedPdfUrl(url);

      message.success(`PDF rotated by ${rotationAngle}° successfully in preview!`);

      setLoading(false);
    } catch (error) {
      console.error('Error rotating PDF:', error);
      message.error('Error rotating PDF: ' + error.message);
      setLoading(false);
    }
  };

  // Run ECG analysis
  const handleAnalysis = async () => {
    if (!fileList[0] || !fileList[0].originFileObj) {
      message.error('Please upload a PDF first');
      return;
    }

    setAnalyzing(true);
    setResponsePdfDocument(null);
    setResponsePdfPreview(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', fileList[0].originFileObj);

      // Make API call
      const response = await fetch('http://localhost:8000/ecg_analysis', {
        method: 'POST',
        body: formData,
        headers: {
          'accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Check if the response is JSON or blob
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response
        const result = await response.json();
        setModelResponse(result.analysis || "ECG analysis completed successfully.");

        // If the JSON response contains a PDF URL
        if (result.pdf_url) {
          // Fetch the PDF from the provided URL
          const pdfResponse = await fetch(result.pdf_url);
          if (pdfResponse.ok) {
            const pdfBlob = await pdfResponse.blob();
            const url = URL.createObjectURL(pdfBlob);
            setOutputPdfUrl(url);
            await loadResponsePdf(url);
          }
        } else if (result.pdf_base64) {
          // If the JSON response contains a base64 encoded PDF
          const binaryString = atob(result.pdf_base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(pdfBlob);
          setOutputPdfUrl(url);
          await loadResponsePdf(url);
        }
      } else {
        // Handle direct PDF response
        const pdfBlob = await response.blob();
        const url = URL.createObjectURL(pdfBlob);
        setOutputPdfUrl(url);
        setModelResponse("ECG analysis completed successfully. You can download the PDF report below.");
        await loadResponsePdf(url);
      }

      message.success('ECG analysis completed');
    } catch (error) {
      console.error('Error analyzing ECG:', error);
      message.error('Error analyzing ECG: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Effect to handle rotation option and angle changes
  useEffect(() => {
    if (pdfDocument && rotateOption === 'Yes') {
      handleRotate();
    } else if (rotateOption === 'No') {
      setRotatedPreview(null);
      setRotatedPdfUrl(null);
    }
  }, [rotationAngle, rotateOption, pdfDocument]);

  // Effect to clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (rotatedPdfUrl) URL.revokeObjectURL(rotatedPdfUrl);
      if (outputPdfUrl) URL.revokeObjectURL(outputPdfUrl);
    };
  }, [rotatedPdfUrl, outputPdfUrl]);

  // Handler for Accept Suggestion
  const handleAcceptSuggestion = () => {
    setIsAcceptModalVisible(true);
  };

  // Handler for Refer to Doctor
  const handleReferToDoctor = () => {
    setIsReferModalVisible(true);
  };


  return (
    <div className={styles.container}>
      <Title level={2} className={styles.mainTitle}>ECG Analyzer</Title>

      {/* Hidden canvases for PDF rendering */}
      <div style={{ display: 'none' }}>
        <canvas ref={canvasRef}></canvas>
        <canvas ref={rotatedCanvasRef}></canvas>
        <canvas ref={responsePdfCanvasRef}></canvas>
      </div>

      <Row gutter={24}>
        {/* Left Sidebar / Configuration */}
        <Col span={6} className={styles.responsiveCol}>
          <Card
            title="Upload and Configure PDF"
            className={styles.card}
            bodyStyle={{ className: styles.configuratorSection }}
          >
            <Upload
              beforeUpload={(file) => {
                const isPDF = file.type === 'application/pdf';
                if (!isPDF) {
                  message.error('You can only upload PDF files!');
                }
                return isPDF || Upload.LIST_IGNORE;
              }}
              fileList={fileList}
              onChange={handleFileUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} loading={!pdfJsLoaded} className={styles.uploadButton}>
                Upload PDF
              </Button>
            </Upload>

            <Divider />

            <div>
              <Text strong>Rotate the PDF?</Text>
              <Radio.Group
                options={[
                  { label: 'No', value: 'No' },
                  { label: 'Yes', value: 'Yes' },
                ]}
                onChange={(e) => setRotateOption(e.target.value)}
                value={rotateOption}
                style={{ display: 'block', marginTop: '8px' }}
                disabled={!pdfDocument}
              />
            </div>

            {rotateOption === 'Yes' && (
              <div style={{ marginTop: '16px' }}>
                <Text strong>Rotation Angle</Text>
                <Select
                  value={rotationAngle}
                  style={{ width: '100%', marginTop: '8px' }}
                  onChange={(value) => setRotationAngle(value)}
                  disabled={!pdfDocument}
                >
                  <Option value={0}>0°</Option>
                  <Option value={90}>90°</Option>
                  <Option value={180}>180°</Option>
                  <Option value={270}>270°</Option>
                </Select>
              </div>
            )}
            {/* 
            <div style={{ marginTop: '16px' }}>
              <Text strong>Zoom Factor for Image Resolution</Text>
              <Slider
                min={1}
                max={5}
                value={zoomFactor}
                onChange={(value) => setZoomFactor(value)}
                disabled={!pdfDocument}
              />
            </div> */}
          </Card>

          {pageRotationInfo.length > 0 && (
            <Card title="PDF Rotation Information" style={{ marginTop: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
              {pageRotationInfo.map((info, index) => (
                <p key={index}>Page {info.page}: Rotation Angle = {info.angle}°</p>
              ))}
            </Card>
          )}
        </Col>

        {/* Main Content Area */}
        <Col span={18}>
          <Row gutter={[16, 16]}>
            {/* PDF Preview */}
            <Col span={12} className={styles.responsiveCol}>
              <Card title="Preview First Page" className={styles.card}>
                {loading && <div style={{ textAlign: 'center', margin: '20px' }}>Loading...</div>}
                {!loading && pdfPreview ? (
                  <Image
                    src={pdfPreview}
                    alt="PDF Preview"
                    style={{ width: '100%' }}
                  />
                ) : !loading && (
                  <div className={styles.emptyPreview}>
                    <Text type="secondary">Upload a PDF to see preview</Text>
                  </div>
                )}
              </Card>
            </Col>

            {/* Rotated Preview */}
            <Col span={12}>
              {rotateOption === 'Yes' && (
                <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
                  title={`Rotated First Page Preview (${rotationAngle}°)`}
                 
                >
                  {loading && <div style={{ textAlign: 'center', margin: '20px' }}>Loading...</div>}
                  {!loading && rotatedPreview ? (
                    <Image
                      src={rotatedPreview}
                      alt="Rotated PDF Preview"
                      style={{ width: '100%' }}
                    />
                  ) : !loading && (
                    <div style={{
                      background: '#f0f0f0',
                      height: '300px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text type="secondary">Rotate the PDF to see preview</Text>
                    </div>
                  )}
                </Card>
              )}
            </Col>

            {/* Analysis Section */}
            <Col span={24}>
              <Card title="ECG Analysis" className={styles.card}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    icon={<LineChartOutlined />}
                    loading={analyzing}
                    onClick={handleAnalysis}
                    disabled={!pdfDocument}
                    size="large"
                    className={styles.analysisButton}
                  >
                    Analyze ECG
                  </Button>

                  {modelResponse && (
                    <>
                      <Card title="Analysis Results" bordered={false}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Paragraph>{modelResponse}</Paragraph>

                          {/* Response PDF Page 2 Preview */}
                          {responsePdfPreview && (
                            <div>
                              <Title level={4}>Report Preview</Title>
                              <Image
                                src={responsePdfPreview}
                                alt="Response PDF Page 2"
                                style={{ width: '120%', maxHeight: '900px', objectFit: 'fill' }}
                              />
                            </div>
                          )}
                          {/* <Space style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}> */}
                          <div style={{display:"flex", gap:"20px",alignItems:"center",justifyContent:"center"}}>
                            <Button
                              type="primary"
                              icon={<CheckCircleOutlined />}
                              onClick={handleAcceptSuggestion}
                              size="large"
                              className={styles.acceptSuggestionButton}
                            >
                              Accept Suggestion
                            </Button>
                            <Button
                              type="default"
                              icon={<MedicineBoxOutlined />}
                              onClick={handleReferToDoctor}
                              size="large"
                              className={styles.acceptSuggestionButton}
                            >
                              Refer to Doctor
                            </Button>
                            </div>
                          {/* </Space> */}


                        </Space>
                      </Card>
                    </>
                  )}

                  {outputPdfUrl && (
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={() => window.open(outputPdfUrl, '_blank')}
                      size="large"
                      className={styles.downloadButton}
                    >
                      Download PDF Report
                    </Button>
                  )}
                </Space>
              </Card>
            </Col>

            {/* Accept Suggestion Modal */}
            <Modal
              title="Confirm Suggestion Acceptance"
              visible={isAcceptModalVisible}
              onOk={() => {
                message.success('Suggestion Accepted');
                setIsAcceptModalVisible(false);
              }}
              onCancel={() => setIsAcceptModalVisible(false)}
            >
              <p>Are you sure you want to accept the medical suggestion?</p>
              <p>This will record the recommendation in your health records.</p>
            </Modal>

            {/* Refer to Doctor Modal */}
            <Modal
              title="Refer to Doctor"
              visible={isReferModalVisible}
              footer={null}
              onCancel={() => setIsReferModalVisible(false)}
            >
              <Form layout="vertical">
                <Form.Item
                  name="doctorName"
                  label="Doctor's Name"
                  rules={[{ required: true, message: 'Please input doctor\'s name' }]}
                >
                  <Input placeholder="Enter doctor's name" />
                </Form.Item>

                <Form.Item
                  name="hospital"
                  label="Hospital/Clinic"
                  rules={[{ required: true, message: 'Please input hospital/clinic name' }]}
                >
                  <Input placeholder="Enter hospital or clinic name" />
                </Form.Item>

                <Form.Item
                  name="additionalNotes"
                  label="Additional Notes"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Any additional notes or concerns to share with the doctor"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      message.success('Referral sent successfully');
                      setIsReferModalVisible(false);
                    }}
                  >
                    Send Referral
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </Row>
        </Col>
      </Row>

    </div>
  );
};

export default ECGAnalysis;