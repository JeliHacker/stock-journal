import React, { useState, useEffect } from 'react';

function CustomFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
  const [operator, setOperator] = useState(">=");
  const [value, setValue] = useState("");

  useEffect(() => {
    setFilter((old = []) => [operator, value || undefined]);
  }, [operator, value, setFilter]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <select
        value={operator}
        onChange={e => setOperator(e.target.value)}
        style={{ marginRight: "5px" }}
      >
        {/* Options */}
      </select>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Enter value"
        type="number"
        style={{ width: "70%" }}
      />
    </div>
  );
}

export default CustomFilter;
