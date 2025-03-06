import React, { useState, useEffect } from "react";
import "./UWQuestions.css";
import { Col, Row, Button, Popover, Table, Select } from "antd";
import ModalDesign from "../../layout/Modal";
import FormInput from "../../components/FormInput";
import DropdownSelect from "../../components/FormDropdown";
import PriorityPopup from "../../SidebarComponents/PriorityPopup";

const uwquestionsData = [
  {
    question: "Whether age proof, age at entry and exit has been verified as per product",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }
    ]
  },
  {
    question: "Whether KYC/AML norms for proposer/witness/ premium payer are fulfilled (if required) as per guidelines",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }
    ]
  },
  {
    question: "Whether  document like address proof, id proof, proof of source of funding are verified for authenticity and attestation of proposer and authirized sales representatiove (if required as per the guidelines)",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }
    ]
  },
  {
    question: "Confirm whether proposal form has been witnessed by IA/CIF?",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }
    ]
  },
  {
    question: "Whether occupation details with exact nature of duties and name of the employer has been given ? Whether occupation questionnaire has been obtained if the occupation is hazardous as per UW manual",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "test", label: "Test" }
    ]
  },
  {
    question: "Annual income as per proposal form",
    response: "",
    comment: "",
    options: [
      // { value: "yes", label: "Yes" },
      // { value: "no", label: "No" },
      // { value: "test", label: "Test" }
    ]
  },
  {
    question: "Confirm, if plan details like sum assured, term, SAMF (for ULIP) rider details (if Opted) are entered as per proposal form",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }
    ]
  },
  {
    question: "Confirm whether all alterations, overwriting or cutting in proposal form has been properly authenticated",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }
    ]
  },
  {
    question: "Whether client ID has been checked (new or Existing)",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }
    ]
  },
  {
    question: "Confirm whether premium has been paid by proposer?",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }
    ]
  },
  {
    question: "Confirm whether Source Of Funding has been clearly and fully established",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }
    ]
  },
  {
    question: "Confirm who has paid the premium",
    response: "",
    comment: "",
    options: [
      { value: "proposer", label: "Proposer" },
      { value: "lifeAssured", label: "Life Assured" },
      { value: "parent", label: "Parents" },
      { value: "spouce", label: "Spouce" },
      { value: "company", label: "Company" }
    ]
  },
  {
    question: "Confirm whether proposal has been processed on the basis of income of",
    response: "",
    comment: "",
    options: [
      { value: "self", label: "Self" },
      { value: "spouse", label: "Spouse" },

    ]
  },
  {
    question: "Income proof Submitted",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }

    ]
  },
  {
    question: "All medical reports as per SUC received/uploaded",
    response: "",
    comment: "",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "na", label: "Not Applicable" }
    ]
  }
];

const UWQuestions = ({ onNext }) => {
  const [questions, setQuestions] = useState(uwquestionsData);
  const [notes, setNotes] = useState(" ");
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
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

  const handleResponseChange = (index, newResponse) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].response = newResponse;
    setQuestions(updatedQuestions);
  };

  const handleCommentChange = (index, newComment) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].comment = newComment;
    setQuestions(updatedQuestions);
  };

  const record = {
    client: "Kew Gardens Property",
    lob: "Commercial Property"
  };

  const columns = [
    {
      title: 'Questions',
      dataIndex: 'question',
      key: 'question',
      width: '50%',
      render: (text) => <b>{text}</b>
    },
    {
      title: 'Response',
      dataIndex: 'response',
      key: 'response',
      width: '20%',
      render: (text, record, index) => (
        <DropdownSelect
          options={record.options}
          required={true}
          value={record.response}
          onChange={(value) => handleResponseChange(index, value)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      width: '30%',
      render: (text, record, index) => (
        <FormInput
          value={record.comment}
          onChange={(e) => handleCommentChange(index, e.target.value)}
          style={{ width: '100%' }}
        />
      )
    }
  ];

  return (
    <Row>
      <Col span={24}>
        <div
          className="mainContainer"
          id="uw"
          style={{
            width: '100%',
            overflowX: 'auto',
            padding: isMobile ? '10px' : '20px'
          }}
        >
          <div className="uw-questions-section">
            <h2>UW Questions</h2>
            <Table
              columns={columns}
              dataSource={questions}
              pagination={false}
              scroll={{ x: 800 }}
              style={{
                width: '100%',
                overflowX: 'auto'
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
          </div>

          <div
            className="override-decision-container"
            style={{
              marginBottom: 20,
              width: '100%',
              padding: isMobile ? '10px' : '20px'
            }}
          >
            <h5>Notes</h5>
            <textarea
              className="notes"
              placeholder=""
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                borderRadius: "8px",
                padding: "10px",
                border: "1px solid #d9d9d9",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                resize: "vertical",
              }}
            />

            {/* New Box Below Notes */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid black",
                width: "100%",
              }}
            >
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#d4ebf2",
                  padding: "10px",
                  fontWeight: "bold",
                  fontSize:"14px",
                  textAlign: "center",
                  borderRight: "1px solid black",
                }}
              >
                Final Decision
              </div>
              <div style={{ padding: "10px" }}>
                <Select
                  style={{ width: 120 }}
                  options={[
                    { label: "Accept", value: "accept" },
                    { label: "Decline", value: "decline" },
                    { label: "Postpone", value: "postpone" },
                    { label: "Accept with Extra", value: "accept with extra" },
                    { label: "Refer Case", value: "refercase" },
                  ]}
                  placeholder="Select"
                />
              </div>
            </div>

            {/* <h5 style={{ marginTop: "20px" }}>Claim Propensity</h5> */}
            {/* <div
              style={{
                padding: '16px',
                border: '1px solid #e1e1e1',
                borderRadius: '12px',
                display: 'block',
                width: '100%',
                backgroundColor: 'white',
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                transition: 'box-shadow 0.2s ease-in-out',
                marginBottom: '20px'
              }}
            >
              <Popover
                content={<PriorityPopup predictionData="Medium" record={record} />}
                trigger="click"
                placement="topLeft"
                overlayStyle={{ width: 500 }}
              >
                <Button
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontSize: "16px",
                    width:"150px",
                    height:"40px",
                    padding: "5px 20px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    fontWeight: "600",
                    borderRadius: "4px",
                    color: "white",
                    backgroundColor:"#FAAF25",
                    border: "none",
                    cursor: "pointer",
                    lineHeight: "1.5",
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  Risk - Medium
                </Button>
              </Popover>
            </div> */}
            {/* <div className="decision-container">
              <ModalDesign />
            </div> */}
          </div>
          {/* <Row gutter={16}>
            <Col span={20}></Col>
            <Col span={4}>
              <div>
                <Button
                  type="primary"
                  onClick={onNext}
                  style={{
                    width: "10rem",
                    marginBottom: "1rem",
                    marginTop: "1rem",
                    marginRight: "3px",
                    backgroundColor: "blue",
                  }} 
                >
                  Next
                </Button>
              </div>
            </Col>
          </Row> */}
        </div>
      </Col>
    </Row>
  );
};

export default UWQuestions;