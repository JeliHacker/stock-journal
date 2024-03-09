import React from 'react';
import './App.css'; // Make sure to import the CSS file for styling
import excelLogo from './assets/excel_logo.png'; // Adjust the path as necessary

function App() {
  // Function to handle the download
  const handleDownload = () => {
    // Your logic to download the Excel file goes here
    // For example, assuming you have the file stored in the public folder:
    window.location.href = `${process.env.PUBLIC_URL}/all_stocks_realbackup.xlsx`;
  };

  return (
    <div className="App">
      <div className='header madimi-one-regular'>Stock Journal</div>
      <button className='madimi-one-regular' onClick={handleDownload}>
      <img src={excelLogo} alt="Excel Logo" style={{ marginRight: "10px", width: "24px", height: "24px" }} />
        Download DCF Sheet
      </button>
    </div>
  );
}

export default App;
