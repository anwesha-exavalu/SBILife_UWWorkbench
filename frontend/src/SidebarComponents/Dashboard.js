import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart } from "chart.js/auto";
import { Table, Button, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import "./Dashboard.css";
import "./Table.css";
import { Tabs } from "antd";
import PortfolioInsights from "./PortfolioInsights";
import { Popover } from "antd";
import PriorityPopup from "./PriorityPopup";
import { TableContainer } from "../styles/components/TableComponent";
import useMetaData from "../context/metaData";

const { TabPane } = Tabs;

const MyTableComponent = ({
  columns,
  dataSource,
  handleRowClick,
  handleChange,
}) => {
  const { theme } = useMetaData();
  return (
    <TableContainer theme={theme}>
      <Table
        className="custom-table-header"
        columns={columns}
        dataSource={dataSource}
        onChange={handleChange}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: "clickable-row",
        })}
        pagination={{ pageSize: 3 }}
        components={{
          header: {
            cell: ({ className, ...restProps }) => (
              <th
                {...restProps}
                style={{
                  color: "#fff", // Set header text color here
                }}
              />
            ),
          },
        }}
      />
    </TableContainer>
  );
};

const data = {
  myteamscases: [
    {
      id: "4563748",
      client: "Savings",
      lob: "3",
      status: "Fresh Case",
      limit: "High",
      date: "NO",
      broker: "Agency",
      priority: "Individual",
    },
    {
      id: "2467909",
      client: "Term",
      lob: "12",
      status: "Pending Requirement",
      limit: "High",
      date: "YES",
      broker: "Alternate",
      priority: "Individual",
    },
  ],
  myassignedcases: [
    {
      id: "7862967",
      client: "Ulip",
      lob: "2",
      status: "Fresh Case",
      limit: "High",
      date: "NO",
      broker: "Direct",
      priority: "Individual",
    },
  ],
  senttobroker: [],
  close: [],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const workQueueData = [
    { title: "Fresh Cases", value: 3 },
    { title: "Requirement Received", value: 2 },
    { title: "Medical Dec Received", value: 0 },
    { title: "Pending Requirement", value: 1 },
  ];
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  
  const handleRowClick = (record) => {
    navigate("/createsubmission", { state: { account: record } });
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Proposal Number",
      dataIndex: "id", // Updated to match your data
      key: "id",
      ...getColumnSearchProps("id"),
      filters: [
        ...new Set(
          data.myteamscases
            .concat(data.myassignedcases, data.senttobroker, data.close)
            .map((item) => ({ text: item.id, value: item.id }))
        ),
      ],
      filteredValue: filteredInfo?.id || null,
      onFilter: (value, record) => record.id.includes(value),
    },
    {
      title: "Plan Type",
      dataIndex: "client", // Updated
      key: "client",
      ...getColumnSearchProps("client"),
    },
    {
      title: "Ageing",
      dataIndex: "lob", // Updated
      key: "lob",
      ...getColumnSearchProps("lob"),
    },
    {
      title: "Priority",
      dataIndex: "limit", // Updated
      key: "limit",
    },
    {
      title: "Medical Case",
      dataIndex: "status", // Updated
      key: "status",
      ...getColumnSearchProps("status"),
    },
    {
      title: "Proposal Status",
      dataIndex: "date", // Updated
      key: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Channel",
      dataIndex: "broker", // Updated
      key: "broker",
      ...getColumnSearchProps("broker"),
    },
    {
      title: "Proposal Category",
      dataIndex: "priority", // Updated
      key: "priority",
    },
  ];

  return (
    <div style={{ padding: "10px" }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="My Dashboard" key="1">
          <div className="content">
            {/* Work Queue Summary Boxes */}
            <div className="summary-boxes">
              {workQueueData.map((item, index) => (
                <div key={index} className="summary-box">
                  <h4>{item.title}</h4>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>

            <Tabs defaultActiveKey="1">
              <TabPane tab="My Work Queue" key="1">
                <MyTableComponent
                  columns={columns}
                  dataSource={[
                    ...data.myteamscases,
                    ...data.myassignedcases,
                    ...data.senttobroker,
                    ...data.close,
                  ]}
                  handleRowClick={handleRowClick}
                  handleChange={handleChange}
                />
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard;
