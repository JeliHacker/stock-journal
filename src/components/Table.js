import React, { useState, useEffect, useCallback } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import debounce from 'lodash.debounce';
// import CustomFilter from './CustomFilter'; // Adjust the path as necessary

function DebouncedInput({ value, onChange, debounceTimeout = 300, ...props }) {
    const [internalValue, setInternalValue] = useState(value);
  
    // Update internal value when value prop changes
    useEffect(() => {
      setInternalValue(value);
    }, [value]);
  
    // Call the passed onChange function using debounce
    const debouncedOnChange = useCallback(() => {
        const handler = debounce(onChange, debounceTimeout);
  return handler;
    }, [onChange, debounceTimeout]
    );
  
    const handleChange = (event) => {
      setInternalValue(event.target.value);
      debouncedOnChange(event.target.value);
    };
  
    return <input {...props} value={internalValue} onChange={handleChange} />;
  }

  

function Table({ columns, data, filterTypes, setRowsToShow, rowsToShow, dataLength }) {
    const [businessPredictabilityFilter, setBusinessPredictabilityFilter] = useState("");

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter
    } = useTable(
        { 
            columns, 
            data,
            filterTypes
        },
        useFilters,
        useSortBy
        );

  return (
    <div className='table-container'>
      <div>
        <DebouncedInput
          value={businessPredictabilityFilter}
          onChange={(value) => {
            setBusinessPredictabilityFilter(value);
            setFilter('Business Predictability', parseFloat(value) || undefined);
          }}
          placeholder="Filter Business Predictability"
          debounceTimeout={300}
          style={{ marginBottom: '10px' }}
          type="number"
        />
      </div>
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

      {rowsToShow < dataLength && (
        <div className='flex justify-center my-4'>          
        <button id="loadMore" style={{background: 'linear-gradient(to right, #ff7e5f, #feb47b)', color: '#000'}} onClick={() => setRowsToShow(dataLength)}>
          Load All Rows
        </button>
        </div>
      )}
    </div>
  );
}

export default Table;
