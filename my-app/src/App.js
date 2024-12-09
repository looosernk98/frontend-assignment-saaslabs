import React, { useState, useEffect } from "react";
import leftIcon from "./assests/icons/left.svg";
import rightIcon from "./assests/icons/right.svg";
import "./App.css";

const API_URL = "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";
const DEFAULT_RECORDS_PER_PAGE = 5;
const PER_PAGE_RECORD_LIST = [5, 10, 20, 50, 75, 100];
const sortingOptions = [
  {label: 'Least Perecentage Funded', key: "percentage.funded", dir: 'asc'},
  {label: 'Most Perecentage Funded',key: "percentage.funded", dir: 'desc'},
  {label: 'Least Amount Pledged',key: "amt.pledged", dir: 'asc'},
  {label: 'Most Amount Pledged',key: "amt.pledged", dir: 'desc'},
]
function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(
    DEFAULT_RECORDS_PER_PAGE
  );
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const offset = (page - 1) * recordsPerPage;
    let sortedData = [...data.slice(offset, offset + recordsPerPage)];
    if (sortConfig) {
      sortedData.sort((a, b) => {
        const aValue = parseFloat(a[sortConfig.key]);
        const bValue = parseFloat(b[sortConfig.key]);
        return sortConfig.dir === "asc" ? aValue - bValue : bValue - aValue;
      });
    }
    setRecords(sortedData)
  }, [page, data, recordsPerPage, sortConfig]);

  const totalPages = Math.ceil(data.length / recordsPerPage);

  async function fetchData() {
    try {
      const response = await fetch(API_URL);
      const tableData = await response.json();
      setData(tableData);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const handleGotoPage = (e) => {
    setPage(Number(e.target.value));
  };

  const handleNext = () => {
    if(page === totalPages) return;
    setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if(page === 1) return;
    setPage((prev) => prev - 1);
  };

  const handleRecordPerPage = (e) => {
    setRecordsPerPage(Number(e.target.value));
  };

  const handleSortChange = (e) => {
    const selectedOption = sortingOptions[e.target.value];
    setSortConfig(selectedOption);
  };

  return (
    <main className="main">
      <h1 className="heading">Table</h1>
      <div className="sort-container">
        <label htmlFor="sort-selector" className="sr-only">
          Sort By
        </label>
        <select
          id="sort-selector"
          className="sort-dropdown"
          onChange={handleSortChange}
          aria-label="Select sorting option"
        >
          <option value="" disabled selected>
            Select Sorting
          </option>
          {sortingOptions.map((option, index) => (
            <option key={index} value={index}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <table role="grid" aria-label="Data Table">
        <thead>
          <tr>
            <th scope="col" tabIndex={0}>S.No</th>
            <th scope="col" tabIndex={0}>Percentage funded</th>
            <th scope="col" tabIndex={0}>Amount pledged</th>
          </tr>
        </thead>
        <tbody>
          {records?.map((item, index) => (
            <tr key={index} tabIndex={0}>
              <td>{item["s.no"]}</td>
              <td>{item["percentage.funded"]}</td>
              <td>{item["amt.pledged"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="foot">
        <div className="showing" aria-live="polite">
          {`Showing ${(page - 1) * recordsPerPage + 1} - ${page * recordsPerPage} out of ${data.length}`}
        </div>
        <div className="action-col">
          <div
            className={`action-div ${page === 1 ? "disabled" : ""}`}
            onClick={handlePrev}
            aria-label="Go to previous page"
            tabIndex={0}
          >
            <img src={leftIcon} alt="goto_prev_page" />
          </div>
          <div>
            <select 
             data-testid="select-page" 
             className="select-page" 
             onChange={handleGotoPage}
             aria-label="Page selector"
             tabIndex={0}
             >
              {Array.from({ length: totalPages }).map((_, index) => (
                <option 
                 selected={page === index + 1} 
                 value={index + 1}
                 data-testid="page_option"
                >
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`action-div ${page === totalPages ? "disabled" : ""}`}
            onClick={handleNext}
            tabIndex={0}
          >
            <img src={rightIcon} alt="goto_next_page" />
          </div>
          <div>
            <span className="per-page">Records per page</span>
            <select 
             className="record-per-page" 
             onChange={handleRecordPerPage}
             aria-label="Records per page"
             tabIndex={0}
             >
              {PER_PAGE_RECORD_LIST.map((rec, index) => (
                <option
                  data-testid="per_page_record_option"
                  key={index}
                  selected={recordsPerPage === rec}
                  value={rec}
                >
                  {rec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
