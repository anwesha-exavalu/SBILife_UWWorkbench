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
      id: "CP1001",
      client: "Fleet Solutions",
      lob: "Commercial Property",
      status: "Clearance UW",
      limit: "$500,000",
      date: "20-08-2024",
      broker: "Marsh ",
      priority: "Medium",
    },
    {
      id: "CP1002",
      client: "Skyline Residences",
      lob: "Commercial Property",
      status: "Clearance UW",
      limit: "$250,000",
      date: "18-08-2024",
      broker: "Marsh ",
      priority: "Medium",
    },
  ],
  myassignedcases: [
    {
      id: "CP1003",
      client: "Skyline Property Inc.",
      lob: "Commercial Property",
      status: "Awaiting Client Response",
      limit: "$900,000",
      date: "10-15-2024",
      broker: "Marsh ",
      priority: "Medium",
    },
    {
      id: "CP1001",
      client: "Fleet Solutions",
      lob: "Commercial Property",
      status: "Clearance UW",
      limit: "$500,000",
      date: "20-08-2024",
      broker: "Marsh ",
      priority: "Medium",
    },
    {
      id: "CP1006",
      client: "Uptown Commercial Spaces",
      lob: "Commercial Property",
      status: "Broker Review",
      limit: "$450,000",
      date: "17-08-2024",
      broker: "Marsh ",
      priority: "Medium",
    },
    // { id: 'CP1004', client: 'Kew Garden Property Inc.', lob: 'Commercial Property', status: 'New Submission', limit: '$15,000,000', date: '11-05-2024', broker: 'Marsh ', priority: 'High' },
  ],
  senttobroker: [
    {
      id: "CP1006",
      client: "Uptown Commercial Spaces",
      lob: "Commercial Property",
      status: "Broker Review",
      limit: "$450,000",
      date: "17-08-2024",
      broker: "Marsh ",
      priority: "Medium",
    },
    {
      id: "CP1007",
      client: "Client F",
      lob: "Commercial Property",
      status: "Broker Review",
      limit: "$100,000",
      date: "09-08-2024",
      broker: "Marsh ",
      priority: "High",
    },
  ],
  close: [
    {
      id: "CP1009",
      client: "Client F",
      lob: "Commercial Property",
      status: "Approved",
      limit: "$700,000",
      date: "10-08-2024",
      broker: "Marsh ",
      priority: "Low",
    },
    {
      id: "CP1010",
      client: "Client I",
      lob: "Commercial Property",
      status: "Rejected",
      limit: "$300,000",
      date: "11-08-2024",
      broker: "Marsh ",
      priority: "High",
    },
  ],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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
  const policiesChartRef = useRef(null);
  const submissionsChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const createDonutChart = () => {
    const ctx = donutChartRef.current.getContext("2d");
    donutChartRef.current.chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["General Liability", "Commercial Property"],
        datasets: [
          {
            data: [3000000, 7000000], // Updated to millions
            backgroundColor: ["#FF69B4", "#36a2eb"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                // Format the numbers with commas and 'M' suffix
                const value = (context.raw / 1000000).toFixed(1) + "M";
                return `${context.label}: $${value}`;
              },
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    createBarChart(
      policiesChartRef,
      "Policies Issued",
      ["Commercial Property", "General Liability"],
      [30, 25, 40, 35]
    );
    createBarChart(
      submissionsChartRef,
      "Submission in Progress",
      ["Commercial Property", "General Liability"],
      [15, 18, 22, 20]
    );

    return () => {
      [policiesChartRef, submissionsChartRef, donutChartRef].forEach((ref) => {
        if (ref.current) ref.current.chartInstance.destroy();
      });
    };
  }, []);
  useEffect(() => {
    createDonutChart();
    return () => {
      if (donutChartRef.current?.chartInstance) {
        donutChartRef.current.chartInstance.destroy();
      }
    };
  }, []);

  const createBarChart = (chartRef, title, labels, data) => {
    const ctx = chartRef.current.getContext("2d");
    chartRef.current.chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: title, data, backgroundColor: ["#36A2EB", "#ff69b4"] },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  };

  // const createDonutChart = () => {
  //   const ctx = donutChartRef.current.getContext('2d');
  //   donutChartRef.current.chartInstance = new Chart(ctx, {
  //     type: 'doughnut',
  //     data: {
  //       labels: ['New Business', 'Renewal Premium'],
  //       datasets: [{ data: [7000, 3000], backgroundColor: ['#FF6384', '#FFCE56'] }],
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       plugins: { legend: { display: false } },
  //     },
  //   });
  // };

  const handleRowClick = (record) => {
    navigate("/accountdashboard", { state: { account: record } });
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Submission Id",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
      filters: [
        ...new Set(
          data.myteamscases
            .concat(data.myassignedcases, data.senttobroker, data.close)
            .map((item) => ({ text: item.id, value: item.id }))
        ),
      ],
      filteredValue: filteredInfo.id || null,
      onFilter: (value, record) => record.id.includes(value),
    },
    {
      title: "Name",
      dataIndex: "client",
      key: "client",
      ...getColumnSearchProps("client"),
      filters: [
        ...new Set(
          data.myteamscases
            .concat(data.myassignedcases, data.senttobroker, data.close)
            .map((item) => ({ text: item.client, value: item.client }))
        ),
      ],
      filteredValue: filteredInfo.client || null,
      onFilter: (value, record) => record.client.includes(value),
    },
    {
      title: "LOB",
      dataIndex: "lob",
      key: "lob",
      ...getColumnSearchProps("lob"),
      filters: [
        ...new Set(
          data.myteamscases
            .concat(data.myassignedcases, data.senttobroker, data.close)
            .map((item) => ({ text: item.lob, value: item.lob }))
        ),
      ],
      filteredValue: filteredInfo.lob || null,
      onFilter: (value, record) => record.lob.includes(value),
    },
    { title: "Limit", dataIndex: "limit", key: "limit" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
    },
    {
      title: "Date Submitted",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sortOrder: sortedInfo.columnKey === "date" ? sortedInfo.order : null,
    },
    {
      title: "Broker",
      dataIndex: "broker",
      key: "broker",
      ...getColumnSearchProps("broker"),
    },
    {
      title: "Claim Propensity",
      dataIndex: "priority",
      key: "priority",
      render: (priority, record) => (
        <Popover
          content={<PriorityPopup priority={priority} record={record} />}
          trigger="click"
          placement="rightTop"
          overlayStyle={{ width: 500 }}
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor:
                priority === "High"
                  ? "#fff1f0"
                  : priority === "Medium"
                  ? "#fffbe6"
                  : "#f6ffed",
              color:
                priority === "High"
                  ? "#cf1322"
                  : priority === "Medium"
                  ? "#d4b106"
                  : "#389e0d",
              cursor: "pointer",
            }}
          >
            {priority}
          </span>
        </Popover>
      ),
    },
    // {
    //   title: 'Action',
    //   key: 'newSubmission',
    //   render: (_, record) => (
    //     <Button
    //       type="primary"
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         console.log("Record data to be passed:", record); // Check if data is there
    //         navigate('/createsubmission', { state: { record } });
    //       }}
    //     >
    //       <div style={{ fontSize: '12px'}}>
    //         Create Submission
    //       </div>
    //     </Button>
    //   ),
    // }
  ];

  const combinedData = [
    ...data.myteamscases,
    ...data.myassignedcases,
    ...data.senttobroker,
  ];

  return (
    <div style={{ padding: "10px" }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="My Dashboard" key="1">
          <div className="content">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "5px",
                flexWrap: "nowrap",
              }}
            >
              <div
                className="chart-container"
                style={{ flex: 1, flexDirection: "column" }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "16px",
                    marginBottom: "5px",
                  }}
                >
                  Policies Issued(YTD)
                </div>
                <canvas
                  ref={policiesChartRef}
                  style={{ maxHeight: "200px", width: "100%" }}
                ></canvas>
              </div>
              <div
                className="chart-container"
                style={{ flex: 1, flexDirection: "column" }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "16px",
                    marginBottom: "5px",
                  }}
                >
                  Submission in Progress(YTD)
                </div>
                <canvas
                  ref={submissionsChartRef}
                  style={{ maxHeight: "200px", width: "100%" }}
                ></canvas>
              </div>
              <div
                className="chart-container"
                style={{ flex: 1, flexDirection: "column" }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "16px",
                    marginBottom: "5px",
                  }}
                >
                  Premium by LOB(Quotes)
                </div>
                <canvas
                  ref={donutChartRef}
                  style={{ maxHeight: "200px", width: "100%" }}
                ></canvas>
              </div>
            </div>
            <Tabs defaultActiveKey="1">
              <TabPane tab="My Work" key="1">
                <MyTableComponent
                  columns={columns}
                  dataSource={data.myassignedcases}
                  handleRowClick={handleRowClick}
                  handleChange={handleChange}
                />
              </TabPane>
              <TabPane tab="My Team Work" key="2">
                <MyTableComponent
                  columns={columns}
                  dataSource={combinedData}
                  handleRowClick={handleRowClick}
                  handleChange={handleChange}
                />
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
        <TabPane tab="My Portfolio" key="2">
          <PortfolioInsights />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard;
