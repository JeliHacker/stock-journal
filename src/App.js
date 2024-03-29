import React, { useState, useEffect } from 'react';
import './App.css'; 
import excelLogo from './assets/excel_logo.png'; 
import Papa from 'papaparse';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Add this line

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
        <table>
          <thead>
            <tr>
              {data[0] && Object.keys(data[0]).map((header) => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => <td key={index}>{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
    </div>
  );
}

export default App;
