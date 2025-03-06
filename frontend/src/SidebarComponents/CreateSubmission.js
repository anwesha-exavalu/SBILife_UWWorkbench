import React, { useState, useEffect } from "react";
import styles from "./CreateSubmission.module.css";
import {
  Col,
  Row,
  Tooltip,
  Button,
  Radio,
  Form,
  Select,
  AutoComplete,
} from "antd";
import FormInput from "../components/FormInput";
import DropdownSelect from "../components/FormControl/DropdownSelect";

import Documents from "../layout/RightSidebar";
import {
  EditOutlined,
  SaveOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Modal, message, Upload } from "antd";
import pdfData from "../assets/documents/DocumentForExtraction02.pdf";
import axios from "axios";
import useMetaData from "../context/metaData";

const PROD_URL = process.env.REACT_APP_PREFILL_URL;
function CreateSubmission({ onNext }) {
  const { theme } = useMetaData();
  // Separate state for each widget section's form data and editing state
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // Separate state for each widget section's form data and editing state
  const [basicInfo, setBasicInfo] = useState({
    orgName: "",
    orgType: "",
    dba: "",
    fein: "",
    tin: "",
    businessActivity: "",
    sicCode: "",
    sicDescription: "",
    naics: "",
    naicsDescription: "",
    yearsInBusiness: "",
    status: "active",
    isEditing: false,
  });

  const [locationInfo, setLocationInfo] = useState({
    pinCode: "",
    addressLine1: "",
    addressLine2: "",
    county: "",
    city: "",
    state: "",
    country: "",
    isEditing: false,
  });

  const [insuredInfo, setInsuredInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    emailId: "",
    countryCode: "",
    phoneNumber: "",
    website: " ",
    isEditing: false,
  });
  const [proposalInfo, setProposalInfo] = useState({
    annualizedPremium: "1,000,000",
    sourcingBranch: "Hyderabad",
    sourcingBank: "SBI",
    medicalCase: "Yes",
    eMailVerified: "Yes",
    kyc: "Complied",
    pep: "No"
  });
  const [proposerInfo, setProposerInfo] = useState({
    salutation: "Mr",
    clientId: "6578903",
    firstName: "Abhishek",
    middleName: "Kumar",
    lastName: "Singh",
    dob: "7/4/1997",
    gender: "Male",
    ageProof: "Aadhaar Card",
    fatherName: "Aakash Kumar",
    address: "245 Gandhi Nagar, BARKATPURA, HYDERABAD -500027",
    education: "Graduate",
    occupationType: "Service",
    occupationNumber: "923",
    companyName: "Vista Nexgen Pvt Ltd",
    annualIncome: "770,000",
    nationality: "Indian",
    countryOfResidence: "India",
    maritalStatus: "Married"
  });

  const [nomineeDetails, setNomineeDetails] = useState({
    salutation: "Mrs",
    clientId: "6595643",
    firstName: "Kajal",
    middleName: "NA",
    lastName: "Singh",
    dob: "10/10/2001",
    gender: "Female",
    relationshipToProposer: "Wife"
  });

  const [insuranceDetails, setInsuranceDetails] = useState({
    objective: "Savings",
    plan: "Super Saver Plan 1",
    frequency: "Annually",
    entryAge: "27",
    exitAge: "37",
    premiumTerm: "5 Years",
    benefitTerm: "10 Years",
    premiumAmount: "104,500",
    extraPremium: "NA",
    taxAmount: "4,500"
  });

  const [medicalHistory, setMedicalHistory] = useState({
    height: "165",
    weight: "64",
    weightChange: "NO",
    diabetesHistory: "NO",
    otherDiseases: "NO",
    hospitalisation: "NO",
    currentTreatment: "NO",
    dateOfDiagnosis: "NO"
  });


  const handleInputChange = (e, section, field) => {
    const value = e.target ? e.target.value : e;

    switch (section) {
      case 'proposalInfo':
        setProposalInfo(prev => ({ ...prev, [field]: value }));
        break;
      case 'proposerInfo':
        setProposerInfo(prev => ({ ...prev, [field]: value }));
        break;
      case 'nomineeDetails':
        setNomineeDetails(prev => ({ ...prev, [field]: value }));
        break;
      case 'insuranceDetails':
        setInsuranceDetails(prev => ({ ...prev, [field]: value }));
        break;
      case 'medicalHistory':
        setMedicalHistory(prev => ({ ...prev, [field]: value }));
        break;
      default:
        break;
    }
  };

  // Toggle editing mode for Basic Information
  // const handleEditInsured = () => {
  //   if (isEditMode) {
  //     // Save functionality - you can add API calls or other save logic here
  //     setBasicInfo((prev) => ({ ...prev, isEditing: false }));
  //     setLocationInfo((prev) => ({ ...prev, isEditing: false }));
  //     setInsuredInfo((prev) => ({ ...prev, isEditing: false }));
  //   } else {
  //     // Edit functionality - existing logic
  //     setBasicInfo((prev) => ({ ...prev, isEditing: true }));
  //     setLocationInfo((prev) => ({ ...prev, isEditing: true }));
  //     setInsuredInfo((prev) => ({ ...prev, isEditing: true }));
  //   }
  //   // Toggle edit mode
  //   setIsEditMode(!isEditMode);
  // };
  const handleEditInsured = () => {
    setIsEditMode(!isEditMode);
  };

  const handleUpload = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUploadFile = ({ file, fileList }) => {
    setFileList(fileList);
    message.success(`${file.name} uploaded successfully`);
  };

  const handleSearchClick = () => {
    Modal.error({
      title: "No such account",
      content: "The person is not insured.",
    });
  };
  useEffect(() => {
    console.log("Edit Mode State:", {
      basicInfo: basicInfo.isEditing,
      locationInfo: locationInfo.isEditing,
      insuredInfo: insuredInfo.isEditing,
    });
  }, [basicInfo.isEditing, locationInfo.isEditing, insuredInfo.isEditing]);

  // const handleEditBasicInfo = () => {
  //     console.log("Edit icon clicked!"); // Log for debugging
  //     setBasicInfo((prevState) => ({
  //         ...prevState,
  //         isEditing: !prevState.isEditing, // Toggle edit mode
  //     }));
  //     console.log("After Edit Toggle: ", !basicInfo.isEditing); // Log toggled state
  // };

  const handleCreateNewBasicInfo = () => {
    console.log("Edit icon clicked!"); // Log for debugging
    setBasicInfo({
      insuredName: "",
      insuredType: "",
      firstName: "",
      isEditing: true, // Enable editing for new entries
    });
  };

  // const handleEditLocationInfo = () => {
  //     setLocationInfo((prevState) => ({
  //         ...prevState,
  //         isEditing: !prevState.isEditing, // Toggle edit mode
  //     }));
  // };

  const handleCreateNewLocationInfo = () => {
    setLocationInfo({
      baseState: "",
      zipCode: "",
      isEditing: true, // Enable editing for new entries
    });
  };

  // const handleEditInsuredInfo = () => {
  //     setInsuredInfo((prevState) => ({
  //         ...prevState,
  //         isEditing: !prevState.isEditing, // Toggle edit mode
  //     }));
  // };

  const handleCreateNewInsuredInfo = () => {
    setInsuredInfo({
      primaryNameInsured: "",
      isEditing: true, // Enable editing for new entries
    });
  };
  // const handleInputChange = (e, section, field) => {
  //   const value = e.target ? e.target.value : e;
  //   if (section === "basicInfo") {
  //     setBasicInfo((prev) => ({ ...prev, [field]: value }));
  //   } else if (section === "locationInfo") {
  //     setLocationInfo((prev) => ({ ...prev, [field]: value }));
  //   } else if (section === "insuredInfo") {
  //     setInsuredInfo((prev) => ({ ...prev, [field]: value }));
  //   }
  // };
  const handleClick = () => {
    navigate("/accountinfo"); // Navigate to accountinfo with row data
  };
  const accountInfo = {
    accountHolder: "Wilson Properties", // Full name as "Account Holder" from AccountInfo
  };

  // Extract first name and last name from accountHolder for comparison
  const [accountFirstName, accountLastName] =
    accountInfo.accountHolder.split(" ");

  // Function to check if names match and navigate or show a pop-up
  // const handleSearchClick = () => {
  //   const { firstName, lastName } = basicInfo;

  //   if (firstName === accountFirstName && lastName === accountLastName) {
  //     navigate("/accountInfo"); // Navigate if names match
  //   } else {
  //     // Show a pop-up if names don't match
  //     Modal.error({
  //       title: "No such account",
  //       content: "The person is not insured.",
  //     });
  //   }
  // };

  // Function to open modal
  const onUpload = () => {
    setIsModalOpen(true);
  };

  // Function to handle modal close
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  // const pdfData = "Aspyre Metro Application_print.pdf"; // Your PDF file path

  const handlePrefill = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const pdfResponse = await fetch(pdfData);
      if (!pdfResponse.ok) {
        throw new Error("Failed to load PDF file");
      }

      const pdfBlob = await pdfResponse.blob();
      const file = new File([pdfBlob], "DocumentForExtraction02.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("file", file);

      const apiResponse = await fetch(`${PROD_URL}/api/process_doc`, {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.message || "Failed to process PDF");
      }

      const responseData = await apiResponse.json();
      console.log("API Response:", responseData);

      if (!responseData.application_details) {
        throw new Error("Invalid response data received");
      }

      // Update form states with response data
      updateFormStates(responseData.application_details);

      setSuccess(true);
      message.success("Form prefilled successfully");
    } catch (error) {
      console.error("Prefill Error:", error);
      setError(error.message);
      message.error(`Failed to prefill form: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateFormStates = (data) => {
    if (!data) return;

    const { insuredInfo, insuredMailingAddress, insuredContactPerson } = data;

    // Update basicInfo state - handle all fields from insuredInfo
    if (insuredInfo) {
      setBasicInfo((prevState) => ({
        ...prevState,
        orgName: insuredInfo.orgName || "",
        orgType: insuredInfo.orgType || "",
        dba: insuredInfo.dba || "",
        fein: insuredInfo.fein || "",
        tin: insuredInfo.tin || "",
        businessActivity: insuredInfo.businessActivity || "",
        sicCode: insuredInfo.sicCode || "",
        sicDescription: insuredInfo.sicDescription || "",
        naics: insuredInfo.naics || "",
        naicsDescription: insuredInfo.naicsDescription || "",
        yearsInBusiness: insuredInfo.yearsInBusiness || "",
        status: insuredInfo.partyStatus || "active",
      }));
    }

    // Update locationInfo state - handle first address from insuredMailingAddress array
    if (insuredMailingAddress && insuredMailingAddress[0]) {
      const address = insuredMailingAddress[0];
      setLocationInfo((prevState) => ({
        ...prevState,
        pinCode: address.pinCode || "",
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        county: address.county || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "",
      }));
    }

    // Update insuredInfo state - handle all fields from insuredContactPerson
    if (insuredContactPerson) {
      setInsuredInfo((prevState) => ({
        ...prevState,
        firstName: insuredContactPerson.firstName || "",
        middleName: insuredContactPerson.middleName || "",
        lastName: insuredContactPerson.lastName || "",
        emailId: insuredContactPerson.emailId || "",
        countryCode: insuredContactPerson.countryCode || "",
        phoneNumber: insuredContactPerson.phoneNumber || "",
        website: insuredContactPerson.website || "",
      }));
    }
  };
  const handleGenderChange = (value) => {
    // Only update if in edit mode
    if (isEditMode) {
      setProposerInfo(prevState => ({
        ...prevState,
        gender: value
      }));
    }
  };
  return (
    <>
      <Row>
        <Col span={24}>
          <div className={styles.maincontainer}>
            <Row gutter={16}>
              <Col span={22}></Col>
              <Col span={2}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {/* <Button
                    type="primary"
                    onClick={handleUpload}
                    style={{ width: "5rem", backgroundColor: "blue" }}
                  >
                    Upload
                  </Button> */}
                  <Button
                    type="primary"

                    style={{ width: "5.5rem" }}
                  >
                    IIB
                  </Button>
                  <Button
                    type="primary"

                    style={{ width: "5.5rem" }}
                  >
                    Client Search
                  </Button>
                  <Tooltip title={isEditMode ? "Save" : "Edit"}>
                    <Button
                      shape="circle"
                      onClick={handleEditInsured}
                      icon={
                        isEditMode ? (
                          <SaveOutlined style={{ fontSize: "20px" }} />
                        ) : (
                          <EditOutlined style={{ fontSize: "20px" }} />
                        )
                      }
                      style={{ fontSize: "20px" }}
                    />
                  </Tooltip>
                  <Tooltip title="Search">
                    <Button
                      shape="circle"
                      onClick={handleSearchClick}
                      icon={<SearchOutlined style={{ fontSize: "20px" }} />}
                      style={{ fontSize: "20px" }}
                    />
                  </Tooltip>
                </div>
              </Col>
            </Row>
            <h4 className={styles.PageTitle}>Proposal Number: 2467909</h4>
            <Row gutter={16}>

              {/* Proposal Info Section */}
              <Col span={24}>
                <div className={styles.widgetBox}>
                  <div className={styles.widgetHeader}>
                    <h3 className={styles.widgetTitle}>Proposal Info</h3>
                  </div>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Annualized Premium"
                        value={proposalInfo.annualizedPremium}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposalInfo", "annualizedPremium")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Sourcing Branch"
                        value={proposalInfo.sourcingBranch}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposalInfo", "sourcingBranch")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Sourcing Bank"
                        value={proposalInfo.sourcingBank}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposalInfo", "sourcingBank")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Medical Case"
                        value={proposalInfo.medicalCase}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposalInfo", "medicalCase")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Email Verified"
                        value={proposalInfo.eMailVerified}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposalInfo", "eMailVerified")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="KYC"
                        value={proposalInfo.kyc}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposalInfo", "kyc")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="PEP"
                        value={proposalInfo.pep}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposalInfo", "pep")}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* Proposer Info Section */}
              <Col span={24}>
                <div className={styles.widgetBox}>
                  <div className={styles.widgetHeader}>
                    <h3 className={styles.widgetTitle}>Proposer Info</h3>
                  </div>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Client ID"
                        value={proposerInfo.clientId}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "clientId")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="First Name"
                        value={proposerInfo.firstName}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "firstName")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Middle Name"
                        value={proposerInfo.middleName}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "middleName")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Last Name"
                        value={proposerInfo.lastName}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "lastName")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Date of Birth"
                        value={proposerInfo.dob}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "dob")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <DropdownSelect
                        name="gender"
                        label="Gender"
                        width="200px"
                        height="50px"
                        defaultValue={{ value: "Male", label: "Male" }} // Default selected value
                        options={[
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                          { value: "Other", label: "Other" }
                        ]}
                        onChange={handleGenderChange}
                        style={{
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Adding box shadow
                          borderRadius: "5px" // Optional: Adding rounded corners for better aesthetics
                        }}
                      />

                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Age Proof"
                        value={proposerInfo.ageProof}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "ageProof")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Father's Name"
                        value={proposerInfo.fatherName}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "fatherName")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Address"
                        value={proposerInfo.address}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "address")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Education"
                        value={proposerInfo.education}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "education")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Occupation Type"
                        value={proposerInfo.occupationType}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "occupationType")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Occupation Number"
                        value={proposerInfo.occupationNumber}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "occupationNumber")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Company Name"
                        value={proposerInfo.companyName}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "companyName")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Annual Income"
                        value={proposerInfo.annualIncome}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "annualIncome")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Nationality"
                        value={proposerInfo.nationality}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "nationality")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Country of Residence"
                        value={proposerInfo.countryOfResidence}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "countryOfResidence")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Marital Status"
                        value={proposerInfo.maritalStatus}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "proposerInfo", "maritalStatus")}
                      />
                    </Col>
                  </Row>

                  {/* Nominee Details Subsection */}
                  <div className={styles.widgetHeader} style={{ marginTop: '20px' }}>
                    <h3 className={styles.widgetTitle}>Nominee Details</h3>
                  </div>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Client ID"
                        value={nomineeDetails.clientId}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "nomineeDetails", "clientId")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="First Name"
                        value={nomineeDetails.firstName}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "nomineeDetails", "firstName")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Middle Name"
                        value={nomineeDetails.middleName}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "nomineeDetails", "middleName")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Last Name"
                        value={nomineeDetails.lastName}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "nomineeDetails", "lastName")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Date of Birth"
                        value={nomineeDetails.dob}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "nomineeDetails", "dob")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <DropdownSelect
                        name="gender"
                        label="Gender"
                        width="200px"
                        height="50px"
                        defaultValue={{ value: "Female", label: "Female" }} // Default selected value
                        options={[
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                          { value: "Other", label: "Other" }
                        ]}
                        onChange={handleGenderChange}
                        style={{
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Adding box shadow
                          borderRadius: "5px" // Optional: Adding rounded corners for better aesthetics
                        }}
                      />
                      </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Relationship to Proposer"
                        value={nomineeDetails.relationshipToProposer}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "nomineeDetails", "relationshipToProposer")}
                      />
                    </Col>
                  </Row>

                  {/* Insurance Details Subsection */}
                  <div className={styles.widgetHeader} style={{ marginTop: '20px' }}>
                    <h3 className={styles.widgetTitle}>Insurance Details</h3>
                  </div>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Objective"
                        value={insuranceDetails.objective}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "insuranceDetails", "objective")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Plan"
                        value={insuranceDetails.plan}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "insuranceDetails", "plan")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Frequency"
                        value={insuranceDetails.frequency}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "insuranceDetails", "frequency")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Entry Age"
                        value={insuranceDetails.entryAge}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "insuranceDetails", "entryAge")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Exit Age"
                        value={insuranceDetails.exitAge}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "insuranceDetails", "exitAge")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Premium Term"
                        value={insuranceDetails.premiumTerm}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "insuranceDetails", "premiumTerm")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Benefit Term"
                        value={insuranceDetails.benefitTerm}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "insuranceDetails", "benefitTerm")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Premium Amount"
                        value={insuranceDetails.premiumAmount}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "insuranceDetails", "premiumAmount")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Extra Premium"
                        value={insuranceDetails.extraPremium}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "insuranceDetails", "extraPremium")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Tax Amount"
                        value={insuranceDetails.taxAmount}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "insuranceDetails", "taxAmount")}
                      />
                    </Col>
                  </Row>

                  {/* Medical History Subsection */}
                  <div className={styles.widgetHeader} style={{ marginTop: '20px' }}>
                    <h3 className={styles.widgetTitle}>Medical History</h3>
                  </div>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Height (in Cms)"
                        value={medicalHistory.height}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "medicalHistory", "height")}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8}>
                      <FormInput
                        label="Currently Under treatment/recovered"
                        value={medicalHistory.currentTreatment}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "medicalHistory", "currentTreatment")}
                      />
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={8}>
                      <FormInput
                        label="Date of Hospitalisation/Surgery Done"
                        value={medicalHistory.hospitalisation}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "medicalHistory", "hospitalisation")}
                      />
                    </Col>

                    </Row>
                    <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput

                        label="Date of Diagnosis"
                        value={medicalHistory.dateOfDiagnosis}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "medicalHistory", "dateOfDiagnosis")}
                      />
                    </Col>
                   
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <FormInput
                        label="Name of disease/disability"
                        value={medicalHistory.otherDiseases}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "medicalHistory", "otherDiseases")}
                      />
                    </Col>
                    

                    </Row>
                    <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={10}>
                      <FormInput

                        label="Have you lost weight of 5 kgs or more in last 6 months"
                        value={medicalHistory.weightChange}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "medicalHistory", "weightChange")}
                      />
                    </Col>
                    
                    </Row>
                    <Row gutter={24}>
                    <Col xs={24} sm={12} md={8} lg={15}>
                      <FormInput

                        label="Do you have history of Diabetes Mellitus/High Blood Sugar/Low blood Sugar or High Cholesterol"
                        value={medicalHistory.diabetesHistory}
                        readOnly={!isEditMode}
                        onChange={(e) => handleInputChange(e, "medicalHistory", "diabetesHistory")}
                      />
                    </Col>
                    
                    </Row>

                

                </div>
              </Col></Row></div></Col></Row>
      {/* Upload Modal */}
      <Modal
        title="Upload File"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            OK
          </Button>,
        ]}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Upload.Dragger
            beforeUpload={() => false} // Prevents auto-upload
            fileList={fileList}
            onChange={handleUploadFile}
            multiple={false} // Allow only one file
            maxCount={1} // Restrict to one file
            showUploadList={true}
            style={{
              padding: "20px",
              border: "2px dashed #1890ff",
              borderRadius: "8px",
            }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: "40px", color: "#1890ff" }} />
            </p>
            <p className="ant-upload-text">Click or Drag File to Upload</p>
            <p className="ant-upload-hint">
              Only one file is allowed. Ensure it is in the correct format.
            </p>
          </Upload.Dragger>
        </div>
      </Modal>
    </>
  );
}

export default CreateSubmission;
