import React, { useState, useEffect, useMemo } from 'react';
import './App.css'; 
import excelLogo from './assets/excel_logo.png'; 
import Papa from 'papaparse';
import { useTable, useSortBy } from 'react-table';

// Define constants for chunk size and initial chunk count
const CHUNK_SIZE = 50;
const INITIAL_CHUNK_COUNT = 1;
const PAGE_SIZE = 50;

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [rowsToShow, setRowsToShow] = useState(INITIAL_CHUNK_COUNT * CHUNK_SIZE);
  
  const [pageCount, setPageCount] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true); // Start loading
    fetch('all_stocks_realbackup.csv') // Fetch the CSV data
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
    window.location.href = `${process.env.PUBLIC_URL}/all_stocks_realbackup.xlsx`;
  };

  const loadMoreData = () => {
    // Set the loadingMore flag to true to show the loading indicator
    setLoadingMore(true);
    
    // Use setTimeout to simulate an async call if needed
    setTimeout(() => {
      // const newVisibleData = data.slice(0, pageCount * PAGE_SIZE + PAGE_SIZE);
      // setVisibleData(newVisibleData);
      setPageCount(pageCount + 1);
      setLoadingMore(false); // Set loadingMore to false once data is loaded
    }, 500); // Simulate a network request delay if you like
  };

  const columns = useMemo(() => {
    if (data.length === 0) {
      return [];
    }
  
    return Object.keys(data[0]).map((key) => {
      return { Header: key, accessor: key };
    });
  }, [data]);

  const visibleData = useMemo(() => data.slice(0, 50), [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: visibleData }, useSortBy);

  if (loading) {
    return <div className="App"><h3>Loading...</h3></div>
  }

  return (
    <div className="App">
        <div className='header madimi-one-regular'>Stock Journal</div>
        <button className='madimi-one-regular' onClick={handleDownload}>
        <img src={excelLogo} alt="Excel Logo" style={{ marginRight: "10px", width: "24px", height: "24px" }} />
          Download DCF Sheet
        </button>
      
      <div className='table-container'>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {rowsToShow < data.length && (
          <button onClick={() => setRowsToShow(data.length)}>
            Load All Rows
          </button>
        )}

        {loadingMore && <div className="loading-icon">Loading...</div>}
        
      </div>
    
    </div>
  );
}

export default App;
