import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import excelLogo from './assets/excel_logo.png';
import Papa from 'papaparse';
import CustomFilter from './components/CustomFilter';
import Table from './components/Table'; // Adjust the import path as necessary
// import { FaArrowDown } from 'react-icons/fa';


// Define constants for chunk size and initial chunk count
const CHUNK_SIZE = 50;
const INITIAL_CHUNK_COUNT = 1;

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowsToShow, setRowsToShow] = useState(INITIAL_CHUNK_COUNT * CHUNK_SIZE);

  // const [pageCount, setPageCount] = useState(1);
  // const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true); // Start loading
    fetch('all_stocks_data.csv') // Fetch the CSV data
      .then((response) => response.text())
      .then((csvText) => {
        // Parse CSV text into JSON
        const jsonData = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        }).data;
        setData(jsonData);
        setLoading(false); // Data is loaded, we can stop loading
      });
  }, []);

  // Function to handle the download
  const handleDownload = () => {
    // Your logic to download the Excel file goes here
    // For example, assuming you have the file stored in the public folder:
    window.location.href = `${process.env.PUBLIC_URL}/all_stocks_data.xlsx`;
  };

  // const loadMoreData = () => {
  //   // Set the loadingMore flag to true to show the loading indicator
  //   setLoadingMore(true);

  //   // Use setTimeout to simulate an async call if needed
  //   setTimeout(() => {
  //     // const newVisibleData = data.slice(0, pageCount * PAGE_SIZE + PAGE_SIZE);
  //     // setVisibleData(newVisibleData);
  //     setPageCount(pageCount + 1);
  //     setLoadingMore(false); // Set loadingMore to false once data is loaded
  //   }, 500); // Simulate a network request delay if you like
  // };

  const columns = useMemo(() => {
    if (data.length === 0) {
      return [];
    }

    return Object.keys(data[0]).map((key) => {
      // Check if the column is "Business Predictability"
      if (key === "Business Predictability") {
        return {
          Header: key,
          accessor: key,
          // Specify the filter type
          filter: "customBusinessPredictabilityFilter",
          // Optionally, add a filter input in the column header
          Filter: CustomFilter,
        };
      }

      // Check if the column is "Ticker"
      if (key === "Symbol") { // Replace "Ticker" with your actual ticker key if different
        return {
          Header: key,
          accessor: key,
          Cell: ({ value }) => (
            <a
              href={`https://dcfteacher.com/browse/${value.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1a0dab', textDecoration: 'none' }} // Optional styling
            >
              {value.toUpperCase()}
            </a>
          ),
        };
      }

      // Return a standard column object for other columns
      return { Header: key, accessor: key };
    });
  }, [data]);

  // const visibleData = useMemo(() => data.slice(0, 50), [data]);

  const filterTypes = useMemo(() => ({
    // Implement custom filter logic
    customFilter: (rows, id, filterValue) => {
      let operator = filterValue[0];
      let value = parseFloat(filterValue[1], 10);

      return rows.filter(row => {
        let rowValue = parseFloat(row.values[id], 10);
        switch (operator) {
          case ">=":
            return rowValue >= value;
          case "<=":
            return rowValue <= value;
          case "=":
            return rowValue === value;
          // Add other cases as needed
          default:
            return true;
        }
      });
    },
  }), []);



  if (loading) {
    return <div className="App"><h3>Loading...</h3></div>
  }

  return (
    <div className="App">
      <div className='header madimi-one-regular hidden md:block'>Stock Pitcher</div>

      <button className='madimi-one-regular absolute button' onClick={handleDownload}>
        <img src={excelLogo} alt="Excel Logo" style={{ marginRight: "10px", width: "24px", height: "24px" }} />
        Download DCF Sheet
      </button>

      <div class="scroll-down text-xl absolute mt-24">
        <span class="hidden md:block" >Last Updated: 3/19/2025</span>
      </div>

      <div class="scroll-down text-4xl mt-96">
        <span class="hidden md:block" >Scroll down to explore stocks!</span>
        <br />
        <svg className="inline ml-2 w-24 h-24" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      <Table
        columns={columns}
        data={data.slice(0, rowsToShow)}
        filterTypes={filterTypes}
        setRowsToShow={setRowsToShow}
        rowsToShow={rowsToShow}
        dataLength={data.length}
      />

    </div>
  );
}

export default App;
