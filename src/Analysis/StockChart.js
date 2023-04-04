// import React, { useState, useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// const StockChart = () => {
//   const [data, setData] = useState([]);
//   const chartRef = useRef();

//   useEffect(() => {
//     const fetchData = async () => {
//       const symbolList = ['AAPL', 'GOOG', 'MSFT'];
//       const apiKey = "ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0";
//       const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&apikey=${apiKey}&symbol=`;
//       const stockData = [];

//       for (const symbol of symbolList) {
//         const response = await fetch(url + symbol);
//         const json = await response.json();
//         const weeklyData = json['Weekly Adjusted Time Series'];
//         const latestDate = Object.keys(weeklyData)[0];
//         const latestPrice = weeklyData[latestDate]['4. close'];
//         stockData.push({ symbol, latestPrice });
//       }

//       setData(stockData);

//       console.log(data)
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (data.length === 0) return;

//     const margin = { top: 10, right: 30, bottom: 30, left: 60 };
//     const width = 600 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     const svg = d3.select(chartRef.current)
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height + margin.top + margin.bottom)
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);

//     const x = d3.scaleTime()
//       .domain(d3.extent(data, d => new Date(d.date)))
//       .range([0, width]);

//     const y = d3.scaleLinear()
//       .domain([0, d3.max(data, d => d.total)])
//       .range([height, 0]);

//     const line = d3.line()
//       .x(d => x(new Date(d.date)))
//       .y(d => y(d.total));

//     svg.append('path')
//       .datum(data)
//       .attr('fill', 'none')
//       .attr('stroke', 'steelblue')
//       .attr('stroke-width', 1.5)
//       .attr('d', line);

//     svg.append('g')
//       .attr('transform', `translate(0,${height})`)
//       .call(d3.axisBottom(x));

//     svg.append('g')
//       .call(d3.axisLeft(y));
//   }, [data]);

//   return <svg ref={chartRef} />;
// };

// export default StockChart;
